import React, { useState, useEffect } from 'react'

const BOOT_LINES = [
  'KATALIST CORE v1.0.0 — Initializing runtime...',
  'Loading graphics subsystem... OK',
  'Establishing secure context... OK',
  'Mounting game library index... OK',
  'Loading user configuration... OK',
  'Connecting to Katalist Network... OK',
  'All systems nominal.',
  'READY.',
]

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress]   = useState(0)
  const [lines, setLines]         = useState([])
  const [fading, setFading]       = useState(false)

  useEffect(() => {
    let lineIndex = 0
    const lineInterval = setInterval(() => {
      if (lineIndex < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[lineIndex]])
        setProgress(Math.round(((lineIndex + 1) / BOOT_LINES.length) * 100))
        lineIndex++
      } else {
        clearInterval(lineInterval)
        setTimeout(() => {
          setFading(true)
          setTimeout(onComplete, 600)
        }, 500)
      }
    }, 180)

    return () => clearInterval(lineInterval)
  }, [])

  return (
    <div style={{
      ...styles.screen,
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }}>
      {/* Background grid */}
      <div style={styles.grid} />

      {/* Ambient orbs */}
      <div style={{ ...styles.orb, top: '20%', left: '15%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)' }} />
      <div style={{ ...styles.orb, bottom: '15%', right: '10%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)' }} />

      <div style={styles.inner}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <HexLogo />
          <div style={styles.logoTitle}>KATALIST</div>
          <div style={styles.logoSub}>GAME LAUNCHER</div>
        </div>

        {/* Boot console */}
        <div style={styles.console}>
          <div style={styles.consoleHeader}>
            <span style={{ color: 'var(--neon-cyan)' }}>◈</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>SYSTEM BOOT LOG</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--neon-cyan)' }}>{progress}%</span>
          </div>
          <div style={styles.consoleBody}>
            {lines.map((line, i) => (
              <div key={i} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: i === lines.length - 1 ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                lineHeight: '1.8',
                animation: 'fade-up 0.2s ease forwards',
              }}>
                <span style={{ color: 'var(--neon-primary)', marginRight: '8px' }}>›</span>
                {line}
              </div>
            ))}
            <span style={{
              display: 'inline-block',
              width: '8px', height: '14px',
              background: 'var(--neon-cyan)',
              marginLeft: '2px',
              animation: 'status-blink 0.8s infinite',
            }} />
          </div>
        </div>

        {/* Progress bar */}
        <div style={styles.progressWrap}>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            <div style={{ ...styles.progressGlow, width: `${progress}%` }} />
          </div>
          <div style={styles.progressLabels}>
            <span style={styles.progressLabel}>INITIALIZING</span>
            <span style={styles.progressPct}>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  screen: {
    position: 'fixed', inset: 0,
    background: 'var(--void)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 10000,
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: `
      linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    animation: 'grid-move 8s linear infinite',
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    animation: 'orb-drift 8s ease-in-out infinite',
    pointerEvents: 'none',
  },
  inner: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '32px', width: '480px',
    position: 'relative',
  },
  logoWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
    animation: 'fade-up 0.6s ease forwards',
  },
  logoTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '48px', fontWeight: '900',
    letterSpacing: '0.3em',
    color: 'var(--text-primary)',
    textShadow: '0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.2)',
    animation: 'flicker 6s infinite',
  },
  logoSub: {
    fontFamily: 'var(--font-display)',
    fontSize: '11px', fontWeight: '600',
    letterSpacing: '0.5em',
    color: 'var(--neon-cyan)',
    opacity: 0.8,
  },
  console: {
    width: '100%',
    background: 'rgba(4,6,13,0.8)',
    border: '1px solid rgba(124,58,237,0.2)',
    borderRadius: '8px',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
    animation: 'fade-up 0.6s 0.2s ease both',
  },
  consoleHeader: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '8px 14px',
    borderBottom: '1px solid rgba(124,58,237,0.1)',
    background: 'rgba(124,58,237,0.05)',
  },
  consoleBody: {
    padding: '12px 14px',
    minHeight: '120px',
    maxHeight: '140px',
    overflowY: 'auto',
  },
  progressWrap: {
    width: '100%',
    animation: 'fade-up 0.6s 0.3s ease both',
  },
  progressTrack: {
    height: '3px',
    background: 'rgba(124,58,237,0.15)',
    borderRadius: '2px',
    position: 'relative',
    overflow: 'visible',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--neon-primary), var(--neon-cyan))',
    borderRadius: '2px',
    transition: 'width 0.18s ease',
  },
  progressGlow: {
    position: 'absolute', top: '-2px',
    height: '7px',
    background: 'linear-gradient(90deg, transparent, var(--neon-cyan))',
    borderRadius: '4px',
    filter: 'blur(4px)',
    transition: 'width 0.18s ease',
    opacity: 0.7,
  },
  progressLabels: {
    display: 'flex', justifyContent: 'space-between',
    marginTop: '8px',
  },
  progressLabel: {
    fontFamily: 'var(--font-display)', fontSize: '9px',
    letterSpacing: '0.2em', color: 'var(--text-muted)',
  },
  progressPct: {
    fontFamily: 'var(--font-mono)', fontSize: '11px',
    color: 'var(--neon-cyan)',
  },
}

function HexLogo() {
  return (
    <svg width="80" height="90" viewBox="0 0 80 90" style={{ animation: 'float 3s ease-in-out infinite' }}>
      <defs>
        <linearGradient id="hex-g1" x1="0" y1="0" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="hex-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <polygon points="40,4 74,22 74,68 40,86 6,68 6,22"
        fill="rgba(124,58,237,0.08)" stroke="url(#hex-g1)" strokeWidth="1.5" filter="url(#hex-glow)" />
      <polygon points="40,16 62,28 62,62 40,74 18,62 18,28"
        fill="rgba(6,182,212,0.05)" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
      <circle cx="40" cy="45" r="10" fill="rgba(124,58,237,0.3)" stroke="url(#hex-g1)" strokeWidth="1.5" />
      <circle cx="40" cy="45" r="4" fill="#8b5cf6" filter="url(#hex-glow)" />
      {/* Corner marks */}
      {[[40,4],[74,22],[74,68],[40,86],[6,68],[6,22]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="var(--neon-cyan)" opacity="0.6" />
      ))}
    </svg>
  )
}
