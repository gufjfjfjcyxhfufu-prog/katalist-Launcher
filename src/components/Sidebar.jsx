import React, { useState } from 'react'

const NAV_ITEMS = [
  { id: 'library',  icon: <GamepadIcon />,  label: 'Library',   sub: 'Your Games' },
  { id: 'recent',   icon: <ClockIcon />,    label: 'Recent',    sub: 'History' },
  { id: 'store',    icon: <StoreIcon />,    label: 'Store',     sub: 'Browse' },
  { id: 'friends',  icon: <FriendsIcon />,  label: 'Community', sub: 'Online' },
]

export default function Sidebar({ active, onSelect, gameStatus, gameName }) {
  const [hovered, setHovered] = useState(null)

  return (
    <aside style={styles.sidebar}>
      {/* Top decorative line */}
      <div style={styles.topAccent} />

      {/* Status panel */}
      <div style={styles.statusPanel}>
        <div style={styles.statusDot(gameStatus)} />
        <div>
          <div style={styles.statusLabel}>
            {gameStatus === 'running' ? 'RUNNING' : gameStatus === 'loaded' ? 'LOADED' : 'STANDBY'}
          </div>
          <div style={styles.statusSub}>
            {gameName || 'No game selected'}
          </div>
        </div>
      </div>

      <div style={styles.divider} />

      {/* Nav items */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id
          const isHover = hovered === item.id
          return (
            <button
              key={item.id}
              style={styles.navItem(isActive, isHover)}
              onClick={() => onSelect(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {(isActive || isHover) && <div style={styles.activeBar} />}
              <div style={styles.iconWrap(isActive, isHover)}>
                {item.icon}
              </div>
              <div style={styles.labelGroup}>
                <span style={styles.label(isActive, isHover)}>{item.label}</span>
                <span style={styles.sublabel}>{item.sub}</span>
              </div>
              {isActive && <div style={styles.activeDot} />}
            </button>
          )
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Bottom system info */}
      <div style={styles.sysInfo}>
        <div style={styles.sysRow}>
          <span style={styles.sysLabel}>BUILD</span>
          <span style={styles.sysVal}>v1.0.0</span>
        </div>
        <div style={styles.sysRow}>
          <span style={styles.sysLabel}>PLATFORM</span>
          <span style={styles.sysVal}>WIN64</span>
        </div>
        <div style={styles.scanline} />
      </div>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: '200px',
    flexShrink: 0,
    background: 'rgba(4, 6, 13, 0.8)',
    borderRight: '1px solid rgba(124,58,237,0.12)',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '16px',
    position: 'relative',
    overflow: 'hidden',
  },
  topAccent: {
    height: '2px',
    background: 'linear-gradient(90deg, var(--neon-primary), var(--neon-cyan), transparent)',
  },
  statusPanel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 16px',
  },
  statusDot: (status) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
    background: status === 'running'
      ? 'var(--status-ok)'
      : status === 'loaded'
      ? 'var(--neon-cyan)'
      : 'var(--text-muted)',
    boxShadow: status === 'running'
      ? '0 0 8px var(--status-ok)'
      : status === 'loaded'
      ? '0 0 8px var(--neon-cyan)'
      : 'none',
    animation: status === 'running' ? 'status-blink 1.5s infinite' : 'none',
  }),
  statusLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '9px',
    letterSpacing: '0.15em',
    color: 'var(--text-accent)',
    fontWeight: '700',
  },
  statusSub: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
    marginTop: '1px',
    maxWidth: '130px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.2), transparent)',
    margin: '0 12px 8px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '0 8px',
  },
  navItem: (isActive, isHover) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 10px',
    borderRadius: '6px',
    background: isActive
      ? 'rgba(124,58,237,0.12)'
      : isHover
      ? 'rgba(255,255,255,0.04)'
      : 'transparent',
    border: isActive ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s var(--ease-out-expo)',
    position: 'relative',
    textAlign: 'left',
    width: '100%',
  }),
  activeBar: {
    position: 'absolute',
    left: 0,
    top: '6px',
    bottom: '6px',
    width: '2px',
    background: 'var(--neon-primary)',
    borderRadius: '0 2px 2px 0',
    boxShadow: '0 0 8px var(--neon-primary)',
  },
  iconWrap: (isActive, isHover) => ({
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    background: isActive
      ? 'rgba(124,58,237,0.2)'
      : isHover
      ? 'rgba(124,58,237,0.08)'
      : 'rgba(255,255,255,0.04)',
    transition: 'background 0.2s',
    flexShrink: 0,
    color: isActive ? 'var(--neon-bright)' : isHover ? 'var(--text-accent)' : 'var(--text-muted)',
  }),
  labelGroup: { display: 'flex', flexDirection: 'column' },
  label: (isActive, isHover) => ({
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.05em',
    color: isActive ? 'var(--text-primary)' : isHover ? 'var(--text-secondary)' : 'var(--text-muted)',
    fontFamily: 'var(--font-ui)',
    lineHeight: 1,
    transition: 'color 0.2s',
  }),
  sublabel: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    marginTop: '2px',
    lineHeight: 1,
  },
  activeDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: 'var(--neon-primary)',
    marginLeft: 'auto',
    boxShadow: '0 0 6px var(--neon-primary)',
    flexShrink: 0,
  },
  sysInfo: {
    margin: '0 8px',
    padding: '10px',
    background: 'rgba(124,58,237,0.05)',
    border: '1px solid rgba(124,58,237,0.1)',
    borderRadius: '6px',
    position: 'relative',
    overflow: 'hidden',
  },
  sysRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  sysLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '8px',
    letterSpacing: '0.15em',
    color: 'var(--text-muted)',
  },
  sysVal: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--neon-cyan)',
  },
  scanline: {
    position: 'absolute',
    left: 0, right: 0,
    height: '30%',
    background: 'linear-gradient(transparent, rgba(124,58,237,0.03), transparent)',
    animation: 'data-scroll 3s linear infinite',
    pointerEvents: 'none',
  },
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function GamepadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="4" />
      <path d="M6 12h4M8 10v4M15 11h.01M17 13h.01" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}
function StoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3h18l-2 9H5L3 3z" />
      <path d="M5 12l1 9h12l1-9" />
      <path d="M9 21V12M15 21V12" />
    </svg>
  )
}
function FriendsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87" />
    </svg>
  )
}
