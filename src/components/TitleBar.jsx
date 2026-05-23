import React, { useState } from 'react'
import { useElectron } from '../hooks/useElectron'

export default function TitleBar({ activeView, onNavigate }) {
  const electron = useElectron()
  const [hoveredBtn, setHoveredBtn] = useState(null)

  const navItems = [
    { id: 'home',     label: 'LIBRARY' },
    { id: 'settings', label: 'SETTINGS' },
  ]

  const styles = {
    bar: {
      display: 'flex',
      alignItems: 'center',
      height: '44px',
      background: 'rgba(4, 6, 13, 0.95)',
      borderBottom: '1px solid rgba(124, 58, 237, 0.15)',
      WebkitAppRegion: 'drag',
      flexShrink: 0,
      position: 'relative',
      zIndex: 100,
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '0 16px',
      WebkitAppRegion: 'no-drag',
    },
    logoIcon: {
      width: '22px',
      height: '22px',
      position: 'relative',
    },
    logoText: {
      fontFamily: 'var(--font-display)',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.25em',
      color: 'var(--text-accent)',
    },
    divider: {
      width: '1px',
      height: '20px',
      background: 'rgba(124,58,237,0.25)',
      margin: '0 4px',
    },
    nav: {
      display: 'flex',
      gap: '2px',
      WebkitAppRegion: 'no-drag',
    },
    navItem: (isActive) => ({
      padding: '6px 14px',
      fontSize: '11px',
      fontFamily: 'var(--font-display)',
      fontWeight: '600',
      letterSpacing: '0.12em',
      color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
      background: isActive ? 'rgba(124,58,237,0.12)' : 'transparent',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'all 0.2s',
      position: 'relative',
    }),
    spacer: { flex: 1 },
    windowControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '0',
      WebkitAppRegion: 'no-drag',
      height: '100%',
    },
    winBtn: (type, isHovered) => ({
      width: '46px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isHovered
        ? type === 'close' ? 'rgba(239,68,68,0.8)' : 'rgba(255,255,255,0.07)'
        : 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'background 0.15s',
      color: isHovered ? '#fff' : 'var(--text-muted)',
    }),
  }

  return (
    <div style={styles.bar}>
      {/* Logo */}
      <div style={styles.logo}>
        <LogoSVG />
        <span style={styles.logoText}>KATALIST</span>
      </div>

      <div style={styles.divider} />

      {/* Nav */}
      <nav style={styles.nav}>
        {navItems.map(item => (
          <button
            key={item.id}
            style={styles.navItem(activeView === item.id)}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
            {activeView === item.id && (
              <span style={{
                position: 'absolute', bottom: '3px', left: '14px', right: '14px',
                height: '1px', background: 'var(--neon-primary)',
                boxShadow: '0 0 6px var(--neon-primary)',
              }} />
            )}
          </button>
        ))}
      </nav>

      <div style={styles.spacer} />

      {/* Window controls */}
      {electron.isElectron && (
        <div style={styles.windowControls}>
          {[
            { type: 'minimize', label: '─', action: electron.window.minimize },
            { type: 'maximize', label: '⊡', action: electron.window.maximize },
            { type: 'close',    label: '✕', action: electron.window.close },
          ].map(btn => (
            <button
              key={btn.type}
              style={styles.winBtn(btn.type, hoveredBtn === btn.type)}
              onMouseEnter={() => setHoveredBtn(btn.type)}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={btn.action}
              title={btn.type}
            >
              <span style={{ fontSize: btn.type === 'maximize' ? '12px' : '11px' }}>
                {btn.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function LogoSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <polygon
        points="11,1 20,6 20,16 11,21 2,16 2,6"
        fill="none"
        stroke="url(#lg1)"
        strokeWidth="1.5"
      />
      <polygon
        points="11,5 16,8 16,14 11,17 6,14 6,8"
        fill="rgba(124,58,237,0.2)"
        stroke="url(#lg1)"
        strokeWidth="1"
      />
      <circle cx="11" cy="11" r="2" fill="#8b5cf6" />
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  )
}
