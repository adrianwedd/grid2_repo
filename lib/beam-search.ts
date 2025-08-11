// lib/beam-search.ts
// Beam search implementation for optimal section selection

import type {
  SectionNode,
  SectionMeta,
  BeamSearchConfig,
  ScoringContext,
  ContentGraph,
  BrandTokens,
  Tone,
  HardConstraint,
  SoftConstraint,
  ContentSlot,
  SectionKind,
} from '@/types/section-system';

type Beam = {
  sections: SectionNode[];
  score: number;
  satisfiedContent: Set<string>;
  violations: string[];
};

const uid = () =>
  (globalThis as any).crypto?.randomUUID?.() ??
  `id_${Math.random().toString(36).slice(2)}`;

export class BeamSearchAssembler {
  private config: BeamSearchConfig;
  private sectionLibrary: SectionMeta[];

  constructor(sectionLibrary: SectionMeta[], config: Partial<BeamSearchConfig> = {}) {
    this.sectionLibrary = sectionLibrary;
    this.config = {
      beamWidth: config.beamWidth ?? 5,
      maxDepth: config.maxDepth ?? 7,
      scorer: config.scorer ?? this.defaultScorer,
    };
  }

  /**
   * Main search algorithm
   */
  async search(
    content: ContentGraph,
    brand: BrandTokens,
    tone: Tone,
    requiredSections: SectionKind[] = ['hero', 'features', 'cta']
  ): Promise<{ primary: SectionNode[]; alternates: SectionNode[][] }> {
    const context: ScoringContext = {
      content,
      brand,
      tone,
      constraints: {
        hard: this.getGlobalHardConstraints(),
        soft: this.getGlobalSoftConstraints(),
      },
    };

    let beams: Beam[] = [
      {
        sections: [],
        score: 0,
        satisfiedContent: new Set(),
        violations: [],
      },
    ];

    const sectionPlan = this.planSectionOrder(requiredSections, content);

    for (const kind of sectionPlan) {
      const newBeams: Beam[] = [];

      for (const beam of beams) {
        const candidates = this.getCandidates(kind, beam, context);

        for (const candidate of candidates) {
          const newBeam = this.expandBeam(beam, candidate, context);
        }
      }

      // expandBeam moved out for type safety
    }

    // Re-run with explicit loop (to avoid TS inference confusion)
    beams = [
      {
        sections: [],
        score: 0,
        satisfiedContent: new Set(),
        violations: [],
      },
    ];
    for (const kind of sectionPlan) {
      const nextBeams: Beam[] = [];
      for (const beam of beams) {
        const candidates = this.getCandidates(kind, {sections: beam.sections, score: beam.score, satisfiedContent: beam.satisfiedContent, violations: beam.violations}, context);
        for (const candidate of candidates) {
          const nb = this.expandBeam(beam, candidate, context);
          if (!nb.violations.some((v) => v.startsWith('HARD:'))) nextBeams.push(nb);
        }
      }
      beams = this.pruneBeams(nextBeams, this.config.beamWidth);
      if (!beams.length) throw new Error(`No valid layout while placing "${kind}".`);
    }

    // Final aesthetic rescoring
    beams = beams.map((b) => ({ ...b, score: this.finalScore(b, context) }));
    beams.sort((a, b) => b.score - a.score);

    return {
      primary: beams[0].sections,
      alternates: beams.slice(1, 3).map((b) => b.sections),
    };
  }

  /**
   * Expand beam with new section
   */
  private expandBeam(beam: Beam, candidate: SectionMeta, context: ScoringContext): Beam {
    const props = this.generateProps(candidate, context);

    const newSection: SectionNode = {
      id: `${candidate.kind}-${uid()}`,
      meta: candidate,
      props,
      position: beam.sections.length,
    };

    const newSections = [...beam.sections, newSection];
    const violations = this.checkConstraints(newSections, candidate, context);
    const contentCoverage = this.updateContentCoverage(beam.satisfiedContent, candidate);

    return {
      sections: newSections,
      score: this.config.scorer(newSections, candidate, context),
      satisfiedContent: contentCoverage,
      violations: [...beam.violations, ...violations],
    };
  }

  /**
   * Default scoring function
   */
  private defaultScorer = (
    sections: SectionNode[],
    candidate: SectionMeta,
    context: ScoringContext
  ): number => {
    let score = 0;

    // Content fit (40)
    score += this.scoreContentFit(candidate, context.content) * 40;

    // Tone match (20)
    score += this.scoreToneMatch(candidate, context.tone) * 20;

    // Aesthetic flow (20)
    score += this.scoreAestheticFlow(sections, candidate) * 20;

    // Performance (10)
    score += this.scorePerformance(sections, candidate) * 10;

    // Accessibility (10)
    score += this.scoreA11y(sections, candidate) * 10;

    return score;
  };

  private scoreContentFit(meta: SectionMeta, content: ContentGraph): number {
    const sectionContent = (content as any)[meta.kind];
    if (!sectionContent) return 0;

    const required = meta.contentSlots.filter((s) => s.required);
    if (required.length === 0) return 1;

    let satisfied = 0;
    for (const slot of required) {
      if (this.isSlotSatisfied(slot, sectionContent)) satisfied++;
    }
    return satisfied / required.length;
  }

  private isSlotSatisfied(slot: ContentSlot, sectionContent: any): boolean {
    const value = sectionContent?.[slot.key];

    switch (slot.type) {
      case 'text':
        return typeof value === 'string' && this.lenOk(value, slot);
      case 'text[]':
        // allow 'items' alias for features MVP
        if (value == null && sectionContent?.items && slot.key === 'features') {
          return Array.isArray(sectionContent.items) && sectionContent.items.length >= (slot.minLength ?? 1);
        }
        return (
          Array.isArray(value) &&
          value.length >= (slot.minLength ?? 1) &&
          (slot.maxLength ? value.length <= slot.maxLength : true)
        );
      case 'image':
        return !!value && (value.kind === 'image' || value?.src);
      case 'video':
        return !!value && (value.kind === 'video' || value?.src);
      case 'icon':
        return typeof value === 'string' && value.length > 0;
      case 'quote':
        return Array.isArray(value) && value.length > 0;
      case 'stat':
        return Array.isArray(value) && value.length > 0;
      default:
        return false;
    }
  }

  private lenOk(text: string, slot: ContentSlot): boolean {
    if (slot.maxLength && text.length > slot.maxLength) return false;
    if (slot.minLength && text.length < slot.minLength) return false;
    if (slot.validation) {
      try {
        const re = new RegExp(slot.validation);
        return re.test(text);
      } catch {
        return true;
      }
    }
    return true;
  }

  private scoreToneMatch(meta: SectionMeta, tone: Tone): number {
    const map: Record<Tone, string[]> = {
      minimal: ['minimal', 'simple', 'clean'],
      bold: ['full-bleed', 'gradient', 'dramatic', 'animated'],
      playful: ['animated', 'carousel', 'bento', 'playful'],
      corporate: ['professional', 'grid', 'formal', 'mega'],
    };
    const prefs = map[tone];
    const v = String(meta.variant).toLowerCase();
    return prefs.some((p) => v.includes(p)) ? 1 : 0.6;
  }

  private scoreAestheticFlow(sections: SectionNode[], candidate: SectionMeta): number {
    if (sections.length === 0) return 1;
    const last = sections[sections.length - 1];

    // Avoid adjacent heavy sections
    if (last.meta.estimatedSize === 'xl' && candidate.estimatedSize === 'xl') return 0.3;

    // Avoid exact repetition
    if (last.meta.variant === candidate.variant) return 0.5;

    // Rhythm variance
    const sizes = [...sections.map((s) => s.meta.estimatedSize), candidate.estimatedSize];
    return this.rhythmScore(sizes);
  }

  private rhythmScore(sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'>): number {
    const val = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 } as const;
    const nums = sizes.map((s) => val[s]);
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const variance = nums.reduce((sum, n) => sum + (n - mean) ** 2, 0) / nums.length;
    if (variance < 1) return 0.5; // monotonous
    if (variance > 3) return 0.5; // chaotic
    return 1;
  }

  private scorePerformance(sections: SectionNode[], candidate: SectionMeta): number {
    const total = sections.length + 1;
    const anim = sections.filter((s) => s.meta.hasAnimations).length + (candidate.hasAnimations ? 1 : 0);
    const js = sections.filter((s) => s.meta.requiresJs).length + (candidate.requiresJs ? 1 : 0);
    let score = 1;
    if (anim / total > 0.5) score -= 0.3;
    if (js / total > 0.6) score -= 0.2;
    return Math.max(score, 0);
  }

  private scoreA11y(sections: SectionNode[], candidate: SectionMeta): number {
    const hasH1Section = sections.some((s) =>
      s.meta.hardConstraints.includes('h1_once_per_page')
    );
    if (!hasH1Section && candidate.kind !== 'hero') return 0.7; // prefer hero first
    const baseline =
      candidate.a11yChecklist.includes('contrast_aa') &&
      candidate.a11yChecklist.includes('keyboard_navigable');
    return baseline ? 1 : 0.6;
  }

  private checkConstraints(
    sections: SectionNode[],
    candidate: SectionMeta,
    _context: ScoringContext
  ): string[] {
    const violations: string[] = [];

    // h1 once per page
    const h1Sections = sections.filter((s) =>
      s.meta.hardConstraints.includes('h1_once_per_page')
    ).length;
    if (h1Sections > 1) violations.push('HARD: Multiple h1 elements');

    // Soft adjacency: heavy imagery
    if (sections.length > 1) {
      const prev = sections[sections.length - 2];
      const last = sections[sections.length - 1];
      if (
        prev.meta.softConstraints.includes('avoid_adjacent_heavy_imagery') &&
        last.meta.estimatedSize === 'xl'
      ) {
        violations.push('SOFT: Adjacent heavy imagery');
      }
    }

    return violations;
  }

  private updateContentCoverage(current: Set<string>, candidate: SectionMeta): Set<string> {
    const updated = new Set(current);
    updated.add(candidate.kind);
    candidate.contentSlots.forEach((s) => updated.add(`${candidate.kind}.${s.key}`));
    return updated;
  }

  private generateProps(meta: SectionMeta, context: ScoringContext): any {
    const props: any = {
      id: `${meta.kind}-${uid()}`,
      tone: context.tone,
      content: {},
    };
    const sectionContent = (context as any).content?.[meta.kind];
    if (sectionContent) {
      props.content = this.mapContentToProps(sectionContent, meta);
    }
    // CTA actions convenience
    if (meta.kind === 'cta' && context.content.cta?.headline) {
      props.actions = [
        context.content.cta.primaryAction,
        ...(context.content.cta.secondaryAction ? [context.content.cta.secondaryAction] : []),
      ];
    }
    // Media convenience (hero)
    if (meta.kind === 'hero' && context.content.hero?.image) {
      props.media = [context.content.hero.image];
    }
    return props;
  }

  private mapContentToProps(content: any, meta: SectionMeta): Record<string, any> {
    const mapped: Record<string, any> = {};
    for (const slot of meta.contentSlots) {
      if (content[slot.key] != null) {
        mapped[slot.key] = content[slot.key];
      } else if (slot.key === 'features' && Array.isArray(content.items)) {
        // allow features ← items alias
        mapped['features'] = content.items;
      }
    }
    return mapped;
  }

  private getCandidates(
    kind: SectionKind,
    _beam: Beam,
    _context: ScoringContext
  ): SectionMeta[] {
    return this.sectionLibrary.filter((s) => s.kind === kind);
  }

  private planSectionOrder(required: SectionKind[], content: ContentGraph): SectionKind[] {
    const order: SectionKind[] = [...required];

    if (content.about && !order.includes('about')) order.splice(1, 0, 'about');
    if (content.testimonials && !order.includes('testimonials')) order.splice(2, 0, 'testimonials');
    if (!order.includes('footer')) order.push('footer');

    return order.slice(0, this.config.maxDepth);
  }

  private pruneBeams(beams: Beam[], k: number): Beam[] {
    return beams.sort((a, b) => b.score - a.score).slice(0, k);
  }

  private finalScore(beam: Beam, _context: ScoringContext): number {
    let score = beam.score;

    // Coverage bonus
    const required = new Set(['hero', 'features', 'cta']);
    const coverage =
      Array.from(required).filter((k) => beam.satisfiedContent.has(k)).length / required.size;
    score += coverage * 50;

    // Penalties
    const hard = beam.violations.filter((v) => v.startsWith('HARD:')).length;
    const soft = beam.violations.filter((v) => v.startsWith('SOFT:')).length;
    score -= hard * 100;
    score -= soft * 10;

    return Math.max(score, 0);
  }

  private getGlobalHardConstraints(): HardConstraint[] {
    return ['h1_once_per_page', 'img_alt_required', 'mobile_first', 'no_horizontal_scroll'];
  }

  private getGlobalSoftConstraints(): SoftConstraint[] {
    return ['avoid_dense_text_mobile', 'prefer_high_contrast', 'optimize_for_thumb_reach'];
  }
}
