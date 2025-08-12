import type { SectionProps } from '@/types/section-system';

export function GalleryMasonry({ content, tone = 'minimal' }: SectionProps) {
  return (
    <section className="p-8">
      <div className="container mx-auto">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
          <img className="w-full h-auto mb-4" src="https://via.placeholder.com/400x300" alt="placeholder" />
          <img className="w-full h-auto mb-4" src="https://via.placeholder.com/400x500" alt="placeholder" />
          <img className="w-full h-auto mb-4" src="https://via.placeholder.com/400x350" alt="placeholder" />
          <img className="w-full h-auto mb-4" src="https://via.placeholder.com/400x400" alt="placeholder" />
          <img className="w-full h-auto mb-4" src="https://via.placeholder.com/400x250" alt="placeholder" />
          <img className="w-full h-auto mb-4" src="https://via.placeholder.com/400x600" alt="placeholder" />
        </div>
      </div>
    </section>
  );
}

export const GalleryMasonryMeta = {
  meta: {
    kind: 'gallery',
    variant: 'masonry',
    // ... other meta properties
  }
};