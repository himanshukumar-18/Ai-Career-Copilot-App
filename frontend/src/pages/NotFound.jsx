import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const QUICK_LINKS = [
  { label: 'RESUME BUILDER', desc: 'Create your ATS-friendly resume', path: '/resume' },
  { label: 'SKILLS', desc: 'Track your technical skills', path: '/skills' },
  { label: 'AI ANALYSIS', desc: 'Get AI-powered career insights', path: '/analysis' },
]

const NotFound = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Load IBM Plex Mono + Inter from Google Fonts
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  const progressWidth = `${((10 - countdown) / 10) * 100}%`

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Top nav bar ── */}
      <header className="border-b border-[#222] px-6 sm:px-10 py-4 flex items-center justify-between">
        <span
          className="text-[#e53e3e] text-xs font-bold tracking-[3px] uppercase"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          AI Career Copilot
        </span>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-[10px] tracking-[2px] uppercase text-[#555] hover:text-[#e53e3e] transition-colors duration-150 cursor-pointer"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          ← Dashboard
        </button>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-16 sm:py-20">

        {/* Giant bordered 404 hero */}
        <div className="w-full max-w-5xl border border-[#222] relative">

          {/* Top label strip */}
          <div className="border-b border-[#222] px-6 sm:px-10 py-3 flex items-center justify-between">
            <span
              className="text-[10px] font-bold tracking-[3px] text-[#e53e3e] uppercase"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              ERROR_404
            </span>
            <span
              className="text-[10px] text-[#333] tracking-[2px]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              /page-not-found
            </span>
          </div>

          {/* Giant 404 */}
          <div className="border-b border-[#222] px-6 sm:px-10 py-10 sm:py-14 overflow-hidden">
            <div
              className="text-[120px] sm:text-[180px] md:text-[220px] lg:text-[280px] font-bold leading-none tracking-[-8px] select-none"
              style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: 0.85 }}
            >
              <span className="text-[#e53e3e]">4</span>
              <span className="text-[#1c1c1c]">0</span>
              <span className="text-[#e53e3e]">4</span>
            </div>
          </div>

          {/* Message row */}
          <div className="border-b border-[#222] px-6 sm:px-10 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f0f0f0] mb-3 leading-tight"
              >
                Page Not Found
              </h1>
              <p className="text-sm sm:text-base text-[#555] leading-relaxed max-w-lg">
                The route you're looking for doesn't exist or has been moved.
                Your career journey continues — just not here.
              </p>
            </div>

            {/* Countdown block */}
            <div
              className="border border-[#222] p-5 min-w-[200px] shrink-0"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] tracking-[2px] text-[#444] uppercase">Auto Redirect</span>
                <span className="text-lg font-bold text-[#e53e3e] tabular-nums">{countdown}s</span>
              </div>
              <div className="h-[2px] bg-[#1c1c1c] w-full mb-3">
                <div
                  className="h-full bg-[#e53e3e] transition-[width] duration-1000 ease-linear"
                  style={{ width: progressWidth }}
                />
              </div>
              <p className="text-[10px] text-[#333]">→ /dashboard</p>
            </div>
          </div>

          {/* Action buttons row */}
          <div className="px-6 sm:px-10 py-6 flex flex-wrap gap-0 border-b border-[#222]">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#e53e3e] hover:bg-[#c53030] text-white text-xs sm:text-sm font-bold
                         tracking-[1px] uppercase px-8 py-4 transition-colors duration-150
                         cursor-pointer border-r border-[#c53030]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-transparent hover:bg-[#111] text-[#555] hover:text-[#aaa]
                         text-xs sm:text-sm font-bold tracking-[1px] uppercase
                         px-8 py-4 transition-colors duration-150 cursor-pointer
                         border-r border-[#222]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              ← Go Back
            </button>
          </div>

          {/* Quick links row — 3 col bordered grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {QUICK_LINKS.map((link, i) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`
                  text-left p-6 sm:p-8 flex flex-col gap-2
                  hover:bg-[#111] transition-colors duration-150 cursor-pointer group
                  ${i < QUICK_LINKS.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-[#222]' : ''}
                `}
              >
                <span
                  className="text-[9px] font-bold tracking-[2.5px] text-[#e53e3e] uppercase"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {link.label}
                </span>
                <span className="text-xs sm:text-sm text-[#555] group-hover:text-[#888] leading-snug transition-colors duration-150">
                  {link.desc}
                </span>
                <span
                  className="text-[10px] text-[#333] group-hover:text-[#e53e3e] transition-colors duration-200 mt-1"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  →
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Bottom status line */}
        <div
          className="w-full max-w-5xl mt-4 flex flex-col sm:flex-row justify-between gap-1 px-1"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          <span className="text-[9px] text-[#2a2a2a] tracking-[1px]">STATUS 404 · NOT FOUND</span>
          <span className="text-[9px] text-[#2a2a2a] tracking-[1px]">AI CAREER COPILOT V1.0 · REACT + DJANGO</span>
        </div>

      </main>
    </div>
  )
}

export default NotFound
