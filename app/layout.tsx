export const metadata = { title: 'Grid 2.0 Demo' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
