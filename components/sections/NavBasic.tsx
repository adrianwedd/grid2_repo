import type { SectionProps } from '@/types/section-system';

export function NavBasic({ content, tone = 'minimal' }: SectionProps) {
  return (
    <nav className="p-4 bg-gray-100">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-lg">Logo</div>
        <ul className="flex space-x-4">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}

export const NavBasicMeta = {
  meta: {
    kind: 'navigation',
    variant: 'basic',
    // ... other meta properties
  }
};