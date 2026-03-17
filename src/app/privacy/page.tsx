import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Clipstash',
  description: 'How we collect, use, and protect your information.',
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[var(--bg)] flex flex-col items-center py-12 px-6">
      
      {/* Back Button */}
      <div className="w-full max-w-3xl mb-8">
        <Link 
          href="/"
          className="text-sm font-semibold text-[var(--text2)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-2"
        >
          ← Back to Clipstash
        </Link>
      </div>

      {/* Policy Content */}
      <article className="w-full max-w-3xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 md:p-12 animate-fade-in shadow-sm">
        
        <div className="mb-10 border-b border-[var(--border)] pb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)] mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm font-mono text-[var(--text3)]">
            Effective Date: March 17, 2026
          </p>
        </div>

        <div className="space-y-8 text-[var(--text2)] text-base leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">1. Information We Collect</h2>
            <p className="mb-2">We collect information necessary to provide and improve the Clipstash syncing experience:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Information:</strong> When you create an account, we collect your email address. If you sign in using Google, we receive your email address and basic profile info.</li>
              <li><strong>Clipboard Content:</strong> We securely store the text, links, and snippets you save to your account or Guest Mode session.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">2. Guest Mode Considerations</h2>
            <p>
              Guest Mode is designed for quick, frictionless syncing without an account. Data saved in Guest Mode is accessible to <em>anyone</em> who possesses the active 6-character session code. We strongly advise against pasting highly sensitive personal or financial information into a temporary Guest Mode session.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">3. Data Storage and Security</h2>
            <p className="mb-2">
              Clipstash relies on secure third-party service providers (like Supabase) for database hosting and user authentication. 
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Retention:</strong> We retain your clipboard data as long as your account is active. You can delete individual clips at any time.</li>
              <li><strong>Protection:</strong> We implement strict Row Level Security (RLS) to ensure logged-in users can only access their own data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">4. Sharing Your Information</h2>
            <p>
              <strong>We do not sell your personal information or clipboard data.</strong> We only share information with trusted infrastructure providers required to run the application (hosting, database).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">5. Contact Us</h2>
            <p>
              If you have any questions or suggestions about our Privacy Policy, please contact the developer via the portfolio link in the footer.
            </p>
          </section>

        </div>
      </article>
    </main>
  )
}