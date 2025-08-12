import type { SectionProps } from '@/types/section-system';

export function BlogListStandard({ content, tone = 'minimal' }: SectionProps) {
  return (
    <section className="p-8">
      <div className="container mx-auto space-y-8">
        <div className="border-b pb-4">
          <h3 className="font-bold text-2xl mb-2">Blog Post Title 1</h3>
          <p className="text-gray-600 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <a href="#" className="text-blue-500">Read more</a>
        </div>
        <div className="border-b pb-4">
          <h3 className="font-bold text-2xl mb-2">Blog Post Title 2</h3>
          <p className="text-gray-600 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <a href="#" className="text-blue-500">Read more</a>
        </div>
        <div className="border-b pb-4">
          <h3 className="font-bold text-2xl mb-2">Blog Post Title 3</h3>
          <p className="text-gray-600 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <a href="#" className="text-blue-500">Read more</a>
        </div>
      </div>
    </section>
  );
}

export const BlogListStandardMeta = {
  meta: {
    kind: 'blog',
    variant: 'list-standard',
    // ... other meta properties
  }
};