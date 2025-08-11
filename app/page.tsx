export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-10">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold">Grid 2.0 — MVP Demo</h1>
        <p className="text-gray-600">Open <code className="px-1 py-0.5 bg-gray-100 rounded">/demo</code> to see a generated page.</p>
        <a className="inline-flex items-center px-4 py-2 rounded-lg bg-black text-white" href="/demo">Open Demo</a>
      </div>
    </main>
  );
}
