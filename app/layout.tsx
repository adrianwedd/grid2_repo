export const metadata = { 
  title: 'Grid 2.0 - AI Website Builder',
  description: 'AI-powered deterministic website builder with beam search and Claude integration'
};

import { Navigation } from '@/components/Navigation';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        <Navigation />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
