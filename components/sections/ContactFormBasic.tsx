import type { SectionProps } from '@/types/section-system';

export function ContactFormBasic({ content, tone = 'minimal' }: SectionProps) {
  return (
    <section className="p-8">
      <div className="container mx-auto max-w-xl">
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">Name</label>
            <input type="text" id="name" className="w-full border p-2 rounded-lg" />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input type="email" id="email" className="w-full border p-2 rounded-lg" />
          </div>
          <div>
            <label htmlFor="message" className="block mb-1">Message</label>
            <textarea id="message" className="w-full border p-2 rounded-lg" rows={5}></textarea>
          </div>
          <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg">Submit</button>
        </form>
      </div>
    </section>
  );
}

export const ContactFormBasicMeta = {
  meta: {
    kind: 'contact',
    variant: 'basic',
    // ... other meta properties
  }
};