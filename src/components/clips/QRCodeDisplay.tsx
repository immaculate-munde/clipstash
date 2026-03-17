'use client'

import { useState } from 'react'

interface QRCodeDisplayProps {
  sessionCode: string
  onClose?:    () => void
}

export function QRCodeDisplay({ sessionCode, onClose }: QRCodeDisplayProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError,  setImgError]  = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?code=${sessionCode}`
    : `?code=${sessionCode}`

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&bgcolor=ffffff&color=0d0d10&margin=10`

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-3 bg-white rounded-2xl shadow-lg" style={{ minWidth: 224, minHeight: 224 }}>

        {/* Loading skeleton — shown until image loads */}
        {!imgLoaded && !imgError && (
          <div className="w-[200px] h-[200px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
            <span className="text-gray-400 text-xs font-mono">generating…</span>
          </div>
        )}

        {/* Error fallback */}
        {imgError && (
          <div className="w-[200px] h-[200px] bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-2 p-4">
            <span className="text-2xl">📋</span>
            <p className="text-xs text-center text-gray-500 font-mono leading-relaxed">
              QR unavailable.<br />Share the code manually.
            </p>
          </div>
        )}

        {/* QR image — rendered in DOM always so onLoad fires, hidden until loaded */}
        {!imgError && (
          <img
            src={qrSrc}
            alt={`QR code for session ${sessionCode}`}
            width={200}
            height={200}
            style={{ display: imgLoaded ? 'block' : 'none' }}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgLoaded(false); setImgError(true) }}
          />
        )}
      </div>

      {/* Session code label */}
      <div className="text-center">
        <p className="font-mono text-xl font-bold text-[var(--accent)] tracking-[6px]">
          {sessionCode}
        </p>
        <p className="text-xs text-[var(--text3)] font-mono mt-1">
          Scan to join this session
        </p>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-xs text-[var(--text3)] hover:text-[var(--text)] font-mono transition-colors"
        >
          ✕ close
        </button>
      )}
    </div>
  )
}