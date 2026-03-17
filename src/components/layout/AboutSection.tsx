'use client'

import { useState } from 'react'

export function AboutSection() {
  // Track which FAQ is currently open. null means all are closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    // If clicking the already-open one, close it. Otherwise, open the new one.
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    {
      q: 'What is Clipstash?',
      a: 'Clipstash is a free online clipboard that lets you save text, links, code, and notes from any device and instantly access them on another — no cables, no email, no WhatsApp Saved Messages.',
    },
    {
      q: 'How does it work?',
      a: 'Sign up and your clips are saved permanently to your account, synced across every device you log into. No account? Just hit "Generate Code" to get a 6-character session code. Open Clipstash on any other device, enter the code, and your clips are right there.',
    },
    {
      q: 'Do I need to create an account?',
      a: 'Nope! Guest Mode lets you share clips across devices using a session code — no signup needed. If you want your clips saved permanently and accessible anytime, creating a free account takes under 30 seconds.',
    },
    {
      q: 'Is my data safe?',
      a: 'Your clips are private to your account. Guest session clips are only accessible to anyone who knows the 6-character code, so treat it like a password. You can delete any clip at any time, and your data is never sold or shared.',
    },
    {
      q: 'What can I store in Clipstash?',
      a: 'Anything text-based — links, addresses, passwords, code snippets, meeting notes, phone numbers, tracking numbers, you name it. Add optional labels so you can search and find things instantly.',
    },
    {
      q: 'Is Clipstash free?',
      a: 'Yes, completely free. Sign up, start clipping, sync across all your devices — no hidden fees, no paywalls.',
    },
  ]

  return (
    <section className="border-t border-[var(--border)] mt-12 pt-10 pb-12 px-2">
      <div className="max-w-2xl">
        {/* Section heading */}
        <h2 className="text-lg font-extrabold tracking-tight mb-1">About Clipstash</h2>
        <p className="text-sm text-[var(--text2)] mb-8">
          Everything you need to know about your new favourite clipboard.
        </p>

        {/* FAQ list */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            
            return (
              <div 
                key={i} 
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden transition-colors hover:border-[var(--accent)]"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between text-left p-4 focus:outline-none"
                >
                  <span className="text-sm font-bold text-[var(--text)]">{faq.q}</span>
                  
                  {/* Chevron Icon that rotates when open */}
                  <svg
                    className={`w-5 h-5 text-[var(--text2)] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[var(--accent)]' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Expandable Answer */}
                {isOpen && (
                  <div className="px-4 pb-4 animate-fade-in border-t border-[var(--border)] pt-3">
                    <p className="text-sm text-[var(--text2)] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}