'use client'

import { useEffect, useRef, useState } from 'react'

interface QRScannerProps {
  onScan:  (code: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef    = useRef<any>(null)
  const isRunningRef  = useRef(false)
  const [error,    setError]    = useState<string | null>(null)
  const [scanning, setScanning] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')

        if (cancelled) return

        const scanner = new Html5Qrcode('qr-reader')
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText: string) => {
            let code = decodedText.trim().toUpperCase()
            try {
              const url = new URL(decodedText)
              const param = url.searchParams.get('code')
              if (param) code = param.toUpperCase()
            } catch {}

            if (/^[A-Z0-9]{6}$/.test(code)) {
              setScanning(false)
              // Stop then callback — fully catch any stop errors
              scanner.stop()
                .catch(() => {})
                .finally(() => {
                  isRunningRef.current = false
                  onScan(code)
                })
            }
          },
          () => {} // ignore per-frame errors
        )

        isRunningRef.current = true

      } catch (e: any) {
        if (cancelled) return
        const msg = e?.message ?? ''
        if (msg.toLowerCase().includes('permission')) {
          setError('Camera permission denied. Please allow camera access and try again.')
        } else {
          setError('Could not start camera. Please check your browser permissions.')
        }
      }
    }

    startScanner()

    return () => {
      cancelled = true
      // Only stop if scanner is actually running
      if (scannerRef.current && isRunningRef.current) {
        scannerRef.current.stop()
          .catch(() => {})
          .finally(() => { isRunningRef.current = false })
      }
    }
  }, [onScan])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div>
            <p className="font-bold text-sm text-[var(--text)]">Scan Session QR Code</p>
            <p className="text-xs text-[var(--text3)] font-mono mt-0.5">Point at a Clipstash QR code</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-all"
          >
            ✕
          </button>
        </div>

        {/* Scanner viewport */}
        <div className="relative bg-black">
          <div id="qr-reader" className="w-full" style={{ minHeight: 280 }} />

          {/* Corner frame overlay */}
          {scanning && !error && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-52 h-52">
                <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--accent)] rounded-tl-lg" />
                <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--accent)] rounded-tr-lg" />
                <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--accent)] rounded-bl-lg" />
                <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--accent)] rounded-br-lg" />
                <span className="absolute left-2 right-2 top-1/2 h-0.5 bg-[var(--accent)] opacity-70 animate-[scanline_2s_ease-in-out_infinite]" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4">
          {error ? (
            <div className="flex items-start gap-2 text-xs text-[var(--red)] bg-[var(--red-bg)] border border-[rgba(247,110,110,0.2)] rounded-xl p-3">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          ) : scanning ? (
            <p className="text-xs text-center text-[var(--text3)] font-mono">
              Scanning for QR code…
            </p>
          ) : (
            <p className="text-xs text-center text-[var(--green)] font-mono">
              ✓ Code detected! Joining session…
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0%, 100% { transform: translateY(-52px); opacity: 0.4; }
          50%       { transform: translateY(52px);  opacity: 1; }
        }
        #qr-reader video { width: 100% !important; height: auto !important; }
        #qr-reader img   { display: none !important; }
        #qr-reader__header_message,
        #qr-reader__status_span,
        #qr-reader__dashboard { display: none !important; }
      `}</style>
    </div>
  )
}