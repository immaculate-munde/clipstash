export function Footer() {
    const year = new Date().getFullYear()
  
    return (
      <footer className="w-full border-t border-[var(--border)] bg-[var(--bg)] mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
          
          {/* Top Row: Brand & Quick Links */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity">
              {/* Using a subtle grayscale/opacity effect for a professional, muted footer look */}
              <img 
                src="/clipstash-logo.png" 
                alt="Clipstash Logo" 
                className="w-5 h-5 opacity-70 grayscale" 
              />
              <span className="font-semibold text-sm text-[var(--text)] tracking-tight">
                Clipstash
              </span>
            </div>
  
            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--text2)]">
              {/* Add your actual GitHub repo link here if it's open source */}
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-[var(--accent)] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[var(--accent)] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
  
          {/* Bottom Row: Copyright & Creator Attribution */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-6 border-t border-[var(--border)]/40 text-[11px] font-mono text-[var(--text3)]">
            <span>© {year} Clipstash. All rights reserved.</span>
  
            <span className="flex items-center gap-1.5">
              Built with ⚡ by{' '}
              <a
                href="https://mundeimmaculate.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-[var(--text2)] font-semibold
                  hover:text-[var(--accent)] transition-colors duration-150
                  underline underline-offset-2 decoration-[var(--border2)]
                  hover:decoration-[var(--accent)]
                "
              >
                Immaculate Munde
              </a>
            </span>
          </div>
        </div>
      </footer>
    )
  }