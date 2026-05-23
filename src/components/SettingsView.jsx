import React, { useState } from 'react'

export default function SettingsView({ gameState, onClearGame }) {
  const [theme, setTheme] = useState('purple')

  const themes = [
    { id: 'purple', name: 'Void Purple', color: '#7c3aed' },
    { id: 'cyan',   name: 'Cyber Cyan',  color: '#06b6d4' },
    { id: 'green',  name: 'Matrix',       color: '#10b981' },
    { id: 'red',    name: 'Crimson',      color: '#ef4444' },
  ]

  return (
    <div style={styles.view}>
      <div style={styles.bgGrid} />
      <div style={styles.inner}>
        <div style={styles.header}>
          <div style={styles.eyebrow}>SYSTEM</div>
          <h2 style={styles.title}>Settings</h2>
        </div>

        <div style={styles.sections}>
          {/* Game section */}
          <Section title="GAME CONFIGURATION" icon="⊙">
            <Row label="Current Game" value={gameState.name || 'None selected'} />
            <Row label="Executable Path" value={gameState.path || '—'} mono />
            <Row label="Status" value={
              gameState.path
                ? <Badge color="var(--neon-cyan)">Configured</Badge>
                : <Badge color="var(--text-muted)">Not Set</Badge>
            } />
            {gameState.path && (
              <div style={{ marginTop: '8px' }}>
                <button style={styles.dangerBtn} onClick={onClearGame}>
                  Remove Game
                </button>
              </div>
            )}
          </Section>

          {/* Theme section */}
          <Section title="APPEARANCE" icon="◈">
            <div style={styles.themeLabel}>Accent Color</div>
            <div style={styles.themeRow}>
              {themes.map(t => (
                <button
                  key={t.id}
                  style={styles.themeChip(t.color, theme === t.id)}
                  onClick={() => setTheme(t.id)}
                  title={t.name}
                >
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: t.color }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t.name}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* About section */}
          <Section title="ABOUT" icon="◉">
            <Row label="Application" value="Katalist Launcher" />
            <Row label="Version" value="1.0.0" mono />
            <Row label="Runtime" value="Electron + React + Vite" />
            <Row label="Build Target" value="Windows x64" />
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <span style={{ color: 'var(--neon-cyan)' }}>{icon}</span>
        <span style={styles.sectionTitle}>{title}</span>
        <div style={styles.sectionLine} />
      </div>
      <div style={styles.sectionBody}>{children}</div>
    </div>
  )
}

function Row({ label, value, mono }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <span style={{
        ...styles.rowValue,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
        fontSize: mono ? '11px' : '13px',
        maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {value}
      </span>
    </div>
  )
}

function Badge({ color, children }) {
  return (
    <span style={{
      padding: '2px 10px',
      borderRadius: '20px',
      background: `${color}22`,
      border: `1px solid ${color}44`,
      color: color,
      fontFamily: 'var(--font-display)',
      fontSize: '10px', fontWeight: '700',
      letterSpacing: '0.1em',
    }}>
      {children}
    </span>
  )
}

const styles = {
  view: {
    flex: 1, display: 'flex', flexDirection: 'column',
    background: 'var(--deep)', position: 'relative', overflow: 'hidden',
  },
  bgGrid: {
    position: 'absolute', inset: 0,
    backgroundImage: `linear-gradient(rgba(124,58,237,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.02) 1px, transparent 1px)`,
    backgroundSize: '40px 40px', pointerEvents: 'none',
  },
  inner: {
    flex: 1, overflowY: 'auto',
    padding: '28px 40px',
    position: 'relative', zIndex: 1,
  },
  header: {
    marginBottom: '28px',
    animation: 'slide-in-right 0.4s var(--ease-out-expo) both',
  },
  eyebrow: {
    fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.3em',
    color: 'var(--neon-cyan)', marginBottom: '4px',
  },
  title: {
    fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '700',
    color: 'var(--text-primary)', letterSpacing: '0.05em',
  },
  sections: {
    display: 'flex', flexDirection: 'column', gap: '20px',
  },
  section: {
    background: 'rgba(13,18,32,0.6)',
    border: '1px solid rgba(124,58,237,0.12)',
    borderRadius: '10px', overflow: 'hidden',
    animation: 'fade-up 0.35s var(--ease-out-expo) both',
    backdropFilter: 'blur(10px)',
  },
  sectionHeader: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 20px',
    borderBottom: '1px solid rgba(124,58,237,0.08)',
    background: 'rgba(124,58,237,0.04)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: '700',
    letterSpacing: '0.2em', color: 'var(--text-muted)',
  },
  sectionLine: { flex: 1, height: '1px', background: 'rgba(124,58,237,0.08)' },
  sectionBody: { padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  row: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  rowLabel: {
    fontFamily: 'var(--font-ui)', fontSize: '12px',
    color: 'var(--text-muted)', fontWeight: '500',
  },
  rowValue: {
    fontFamily: 'var(--font-ui)', fontSize: '13px',
    color: 'var(--text-primary)',
  },
  dangerBtn: {
    padding: '7px 16px',
    fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '700',
    letterSpacing: '0.08em',
    background: 'rgba(239,68,68,0.1)',
    color: 'var(--status-err)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '6px', cursor: 'pointer',
    transition: 'all 0.2s',
  },
  themeLabel: {
    fontFamily: 'var(--font-display)', fontSize: '11px',
    color: 'var(--text-muted)', marginBottom: '8px',
    letterSpacing: '0.08em',
  },
  themeRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  themeChip: (color, active) => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    background: active ? `${color}22` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? color : 'rgba(255,255,255,0.08)'}`,
    cursor: 'pointer', transition: 'all 0.2s',
  }),
}
