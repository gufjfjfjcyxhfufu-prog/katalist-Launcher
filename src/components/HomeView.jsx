import React, { useState } from 'react'
import { notify } from './Notifications'
import { useElectron } from '../hooks/useElectron'

export default function HomeView({ gameState, onGameSelect, onGameLaunch }) {
  const electron = useElectron()
  const [launchHover, setLaunchHover] = useState(false)
  const [addHover, setAddHover] = useState(false)
  const [launching, setLaunching] = useState(false)

  const hasGame = !!gameState.path

  async function handlePickGame() {
    const result = await electron.dialog.pickGame()
    if (result) {
      onGameSelect(result)
      notify(`Game loaded: ${result.name}`, 'success')
    }
  }

  async function handleLaunch() {
    if (!hasGame) {
      notify('No game installed — select a game first', 'warn')
      return
    }
    setLaunching(true)
    const result = await onGameLaunch()
    setLaunching(false)
    if (result?.success) {
      notify(`Launching ${gameState.name}...`, 'success', 4000)
    } else {
      notify(result?.error || 'Failed to launch game', 'error')
    }
  }

  function handleShowInExplorer() {
    if (gameState.path) {
      electron.shell.showItem(gameState.path)
    }
  }

  return (
    <div style={styles.view}>
      {/* Background atmosphere */}
      <div style={styles.bgGrid} />
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />

      {/* Scan line effect */}
      <div style={styles.scanLine} />

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.headerEyebrow}>GAME LIBRARY</div>
            <h1 style={styles.headerTitle}>Your Games</h1>
          </div>
          <div style={styles.headerActions}>
            <button
              style={styles.addBtn(addHover)}
              onMouseEnter={() => setAddHover(true)}
              onMouseLeave={() => setAddHover(false)}
              onClick={handlePickGame}
            >
              <span style={{ fontSize: '16px' }}>+</span>
              <span>ADD GAME</span>
            </button>
          </div>
        </div>

        {/* Game card section */}
        <div style={styles.cardSection}>
          {hasGame ? (
            <GameCard
              game={gameState}
              onLaunch={handleLaunch}
              onShowExplorer={handleShowInExplorer}
              onReplace={handlePickGame}
              launching={launching}
              isRunning={gameState.status === 'running'}
            />
          ) : (
            <EmptyState onAdd={handlePickGame} />
          )}
        </div>

        {/* Bottom: quick launch bar */}
        <div style={styles.quickBar}>
          <div style={styles.quickBarInner}>
            <div style={styles.quickBarLeft}>
              <div style={styles.gameInfo}>
                <span style={styles.gameInfoLabel}>SELECTED</span>
                <span style={styles.gameInfoValue}>
                  {gameState.name || '—'}
                </span>
              </div>
              {gameState.path && (
                <div style={styles.gameInfo}>
                  <span style={styles.gameInfoLabel}>PATH</span>
                  <span style={{ ...styles.gameInfoValue, fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {gameState.path}
                  </span>
                </div>
              )}
            </div>
            <button
              style={styles.launchBtn(launchHover, !hasGame || launching)}
              onMouseEnter={() => setLaunchHover(true)}
              onMouseLeave={() => setLaunchHover(false)}
              onClick={handleLaunch}
              disabled={!hasGame || launching}
            >
              {launching ? (
                <><SpinnerIcon /><span>LAUNCHING...</span></>
              ) : (
                <><PlayIcon /><span>LAUNCH GAME</span></>
              )}
              {launchHover && hasGame && !launching && <div style={styles.btnShine} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GameCard({ game, onLaunch, onShowExplorer, onReplace, launching, isRunning }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={styles.card(hovered)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top glow strip */}
      <div style={styles.cardTopStrip} />

      {/* Card artwork / placeholder */}
      <div style={styles.cardArt}>
        <div style={styles.cardArtInner}>
          <GameArtSVG name={game.name} />
        </div>
        {isRunning && (
          <div style={styles.runningBadge}>
            <span style={{ animation: 'status-blink 1.5s infinite', display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--status-ok)', marginRight: 6, boxShadow: '0 0 8px var(--status-ok)' }} />
            RUNNING
          </div>
        )}
      </div>

      {/* Card info */}
      <div style={styles.cardInfo}>
        <div style={styles.cardName}>{game.name}</div>
        <div style={styles.cardMeta}>
          <span style={styles.cardMetaItem}>
            <span style={{ color: 'var(--neon-cyan)' }}>◈</span> Installed
          </span>
          <span style={styles.cardMetaDot} />
          <span style={styles.cardMetaItem}>
            <span style={{ color: 'var(--neon-cyan)' }}>⊙</span> Ready
          </span>
        </div>

        {/* Card actions */}
        <div style={styles.cardActions}>
          <button style={styles.cardBtn('primary')} onClick={onLaunch} disabled={launching}>
            {launching ? 'Launching...' : '▶  Play'}
          </button>
          <button style={styles.cardBtn('ghost')} onClick={onShowExplorer} title="Show in Explorer">
            <FolderIcon />
          </button>
          <button style={styles.cardBtn('ghost')} onClick={onReplace} title="Replace game">
            <SwapIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onAdd }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={styles.empty(hovered)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onAdd}
    >
      <div style={styles.emptyIcon}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="rgba(124,58,237,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
          <path d="M24 14v20M14 24h20" stroke="rgba(124,58,237,0.6)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div style={styles.emptyTitle}>No Game Selected</div>
      <div style={styles.emptyBody}>Click to browse and add your game executable</div>
      <div style={styles.emptyHint}>Supports .exe · .app · .sh · .AppImage</div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  view: {
    flex: 1, display: 'flex', flexDirection: 'column',
    position: 'relative', overflow: 'hidden',
    background: 'var(--deep)',
  },
  bgGrid: {
    position: 'absolute', inset: 0,
    backgroundImage: `
      linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    animation: 'grid-move 12s linear infinite',
    pointerEvents: 'none',
  },
  bgOrb1: {
    position: 'absolute', top: '-100px', right: '-80px',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.07), transparent 70%)',
    animation: 'orb-drift 10s ease-in-out infinite', pointerEvents: 'none',
  },
  bgOrb2: {
    position: 'absolute', bottom: '-80px', left: '-60px',
    width: '300px', height: '300px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6,182,212,0.05), transparent 70%)',
    animation: 'orb-drift 14s ease-in-out infinite reverse', pointerEvents: 'none',
  },
  scanLine: {
    position: 'absolute', left: 0, right: 0, height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.15), transparent)',
    animation: 'scan-line 6s linear infinite',
    pointerEvents: 'none', zIndex: 1,
  },
  content: {
    flex: 1, display: 'flex', flexDirection: 'column',
    position: 'relative', zIndex: 2,
    overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '24px 32px 20px',
    borderBottom: '1px solid var(--border-lite)',
    animation: 'slide-in-right 0.4s var(--ease-out-expo) both',
  },
  headerEyebrow: {
    fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.3em',
    color: 'var(--neon-cyan)', marginBottom: '4px',
  },
  headerTitle: {
    fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '700',
    color: 'var(--text-primary)', letterSpacing: '0.05em',
  },
  headerActions: { display: 'flex', gap: '10px' },
  addBtn: (hovered) => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '8px 18px',
    fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '700',
    letterSpacing: '0.1em',
    color: hovered ? 'var(--text-primary)' : 'var(--text-accent)',
    background: hovered ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.08)',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '6px', cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: hovered ? '0 0 20px rgba(124,58,237,0.2)' : 'none',
  }),
  cardSection: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px 32px',
    overflow: 'hidden',
  },
  card: (hovered) => ({
    display: 'flex', gap: '24px',
    background: hovered ? 'rgba(13,18,32,0.95)' : 'rgba(13,18,32,0.8)',
    border: `1px solid ${hovered ? 'rgba(124,58,237,0.4)' : 'rgba(124,58,237,0.15)'}`,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: hovered ? '0 0 40px rgba(124,58,237,0.15), 0 20px 60px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.3)',
    transition: 'all 0.3s var(--ease-out-expo)',
    maxWidth: '680px', width: '100%',
    position: 'relative',
    animation: 'fade-up 0.4s 0.1s var(--ease-out-expo) both',
    backdropFilter: 'blur(20px)',
  }),
  cardTopStrip: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
    background: 'linear-gradient(90deg, var(--neon-primary), var(--neon-cyan))',
  },
  cardArt: {
    width: '200px', flexShrink: 0, position: 'relative',
    background: 'rgba(4,6,13,0.6)',
    borderRight: '1px solid rgba(124,58,237,0.1)',
    overflow: 'hidden',
  },
  cardArtInner: {
    width: '100%', height: '100%', minHeight: '200px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  runningBadge: {
    position: 'absolute', top: '10px', left: '10px',
    display: 'flex', alignItems: 'center',
    padding: '4px 10px',
    background: 'rgba(16,185,129,0.15)',
    border: '1px solid rgba(16,185,129,0.3)',
    borderRadius: '20px',
    fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: '700',
    letterSpacing: '0.15em', color: 'var(--status-ok)',
  },
  cardInfo: {
    padding: '24px 24px 24px 0',
    display: 'flex', flexDirection: 'column', gap: '10px', flex: 1,
  },
  cardName: {
    fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '700',
    color: 'var(--text-primary)', letterSpacing: '0.05em',
  },
  cardMeta: { display: 'flex', alignItems: 'center', gap: '10px' },
  cardMetaItem: {
    fontFamily: 'var(--font-mono)', fontSize: '11px',
    color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px',
  },
  cardMetaDot: {
    width: '3px', height: '3px', borderRadius: '50%',
    background: 'var(--text-muted)',
  },
  cardActions: {
    display: 'flex', gap: '8px', marginTop: '8px',
  },
  cardBtn: (variant) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: variant === 'primary' ? '9px 22px' : '9px 12px',
    fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: '700',
    letterSpacing: '0.08em', cursor: 'pointer', borderRadius: '6px',
    transition: 'all 0.2s',
    ...(variant === 'primary' ? {
      background: 'linear-gradient(135deg, var(--neon-primary), var(--neon-blue))',
      color: 'white', border: 'none',
      boxShadow: '0 0 20px rgba(124,58,237,0.4)',
    } : {
      background: 'rgba(255,255,255,0.05)',
      color: 'var(--text-secondary)',
      border: '1px solid rgba(255,255,255,0.1)',
    }),
  }),
  quickBar: {
    borderTop: '1px solid var(--border-lite)',
    background: 'rgba(4,6,13,0.85)',
    backdropFilter: 'blur(20px)',
    padding: '12px 32px',
    flexShrink: 0,
  },
  quickBarInner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  quickBarLeft: {
    display: 'flex', gap: '32px', alignItems: 'center',
  },
  gameInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  gameInfoLabel: {
    fontFamily: 'var(--font-display)', fontSize: '8px', letterSpacing: '0.2em',
    color: 'var(--text-muted)', fontWeight: '700',
  },
  gameInfoValue: {
    fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: '600',
    color: 'var(--text-primary)',
  },
  launchBtn: (hovered, disabled) => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 28px',
    fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: '700',
    letterSpacing: '0.12em',
    background: disabled
      ? 'rgba(124,58,237,0.1)'
      : hovered
      ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
      : 'linear-gradient(135deg, var(--neon-primary), var(--neon-blue))',
    color: disabled ? 'var(--text-muted)' : 'white',
    border: `1px solid ${disabled ? 'rgba(124,58,237,0.15)' : 'transparent'}`,
    borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.25s',
    boxShadow: disabled ? 'none' : hovered ? '0 0 30px rgba(124,58,237,0.6)' : '0 0 20px rgba(124,58,237,0.3)',
    position: 'relative', overflow: 'hidden',
  }),
  btnShine: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
    animation: 'data-scroll 1s ease infinite',
    pointerEvents: 'none',
  },
  empty: (hovered) => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '12px',
    width: '320px', height: '220px',
    border: `1px dashed ${hovered ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.2)'}`,
    borderRadius: '12px',
    background: hovered ? 'rgba(124,58,237,0.05)' : 'transparent',
    cursor: 'pointer', transition: 'all 0.25s',
    animation: 'fade-up 0.4s var(--ease-out-expo) both',
  }),
  emptyIcon: { opacity: 0.8 },
  emptyTitle: {
    fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: '700',
    letterSpacing: '0.08em', color: 'var(--text-secondary)',
  },
  emptyBody: { fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' },
  emptyHint: {
    fontFamily: 'var(--font-mono)', fontSize: '10px',
    color: 'rgba(124,58,237,0.5)', letterSpacing: '0.1em',
  },
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function PlayIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
}
function SpinnerIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin-slow 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
}
function FolderIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>
}
function SwapIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3l-5 5 5 5M16 21l5-5-5-5M3 8h18M3 16h18" /></svg>
}
function GameArtSVG({ name }) {
  const letter = name ? name[0].toUpperCase() : '?'
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="art-g" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(124,58,237,0.3)" />
          <stop offset="100%" stopColor="rgba(6,182,212,0.2)" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" rx="12" fill="url(#art-g)" />
      <text x="40" y="52" textAnchor="middle" fontFamily="var(--font-display)" fontSize="36" fontWeight="900" fill="rgba(255,255,255,0.6)">{letter}</text>
    </svg>
  )
}
