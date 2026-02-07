import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Generate Images with
          <span className="bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            {" "}
            AI Power
          </span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl">
          Create stunning, unique images in seconds with our advanced AI-powered
          generation platform. Perfect for creators, designers, and innovators.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/generate"
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            Start Creating
          </Link>
          <Link
            href="/auth"
            className="px-8 py-3 rounded-lg border border-slate-600 hover:border-slate-500 text-white font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Lightning Fast",
              description:
                "Generate high-quality images in seconds with our optimized AI models.",
            },
            {
              title: "Highly Customizable",
              description:
                "Fine-tune every aspect of your image with advanced prompt controls.",
            },
            {
              title: "Production Ready",
              description:
                "Download images in multiple formats optimized for any use case.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-400">
          <p>&copy; 2026 Thumb AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
