import type { SectionProps } from '@/types/section-system';

export function PricingTable3Tier({ content, tone = 'minimal' }: SectionProps) {
  return (
    <section className="p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border p-4 rounded-lg">
          <h3 className="font-bold text-xl mb-2">Basic</h3>
          <p className="text-4xl font-bold mb-4">$10</p>
          <ul className="space-y-2">
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
          </ul>
        </div>
        <div className="border p-4 rounded-lg border-blue-500">
          <h3 className="font-bold text-xl mb-2">Pro</h3>
          <p className="text-4xl font-bold mb-4">$25</p>
          <ul className="space-y-2">
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
          </ul>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="font-bold text-xl mb-2">Enterprise</h3>
          <p className="text-4xl font-bold mb-4">$50</p>
          <ul className="space-y-2">
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export const PricingTable3TierMeta = {
  meta: {
    kind: 'pricing',
    variant: '3-tier',
    // ... other meta properties
  }
};