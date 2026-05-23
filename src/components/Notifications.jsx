import React, { useState, useCallback, useRef, useEffect } from 'react'

// Singleton store
let _setNotifs = null
let _idCounter = 0

export function notify(message, type = 'info', duration = 3500) {
  if (!_setNotifs) return
  const id = ++_idCounter
  _setNotifs(prev => [...prev, { id, message, type, exiting: false }])
  setTimeout(() => dismiss(id), duration)
}

function dismiss(id) {
  if (!_setNotifs) return
  _setNotifs(prev => prev.map(n => n.id === id ? { ...n, exiting: true } : n))
  setTimeout(() => {
    _setNotifs(prev => prev.filter(n => n.id !== id))
  }, 350)
}

export function NotificationStack() {
  const [notifs, setNotifs] = useState([])
  useEffect(() => { _setNotifs = setNotifs; return () => { _setNotifs = null } }, [])

  const colors = {
    info:    { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', glow: '#3b82f6', icon: '◈' },
    success: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', glow: '#10b981', icon: '✓' },
    error:   { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  glow: '#ef4444', icon: '⚠' },
    warn:    { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', glow: '#f59e0b', icon: '!' },
  }

  return (
    <div style={{
      position: 'fixed', top: '56px', right: '16px',
      display: 'flex', flexDirection: 'column', gap: '8px',
      zIndex: 9999, pointerEvents: 'none',
    }}>
      {notifs.map(n => {
        const c = colors[n.type] || colors.info
        return (
          <div key={n.id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px',
            background: c.bg,
            border: `1px solid ${c.border}`,
            borderRadius: '8px',
            backdropFilter: 'blur(20px)',
            boxShadow: `0 0 20px ${c.glow}22, 0 4px 24px rgba(0,0,0,0.4)`,
            animation: n.exiting
              ? 'notification-out 0.35s var(--ease-in-expo) forwards'
              : 'notification-in 0.35s var(--ease-out-expo) forwards',
            minWidth: '240px',
            maxWidth: '340px',
            pointerEvents: 'all',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: c.glow,
              flexShrink: 0,
            }}>{c.icon}</span>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              lineHeight: 1.3,
            }}>{n.message}</span>
          </div>
        )
      })}
    </div>
  )
}
