import React, { useState, useEffect, useCallback } from 'react'
import TitleBar from './components/TitleBar'
import Sidebar from './components/Sidebar'
import HomeView from './components/HomeView'
import SettingsView from './components/SettingsView'
import LoadingScreen from './components/LoadingScreen'
import { NotificationStack, notify } from './components/Notifications'
import { useElectron } from './hooks/useElectron'

const INITIAL_GAME_STATE = {
  path:   null,
  name:   null,
  status: 'idle', // idle | loaded | running
}

export default function App() {
  const electron = useElectron()

  const [loading,      setLoading]      = useState(true)
  const [activeView,   setActiveView]   = useState('home')
  const [sidebarTab,   setSidebarTab]   = useState('library')
  const [gameState,    setGameState]    = useState(INITIAL_GAME_STATE)

  // ── Boot: load persisted config ──────────────────────────────────────────
  useEffect(() => {
    async function boot() {
      try {
        const cfg = await electron.config.load()
        if (cfg?.gamePath) {
          setGameState({
            path:   cfg.gamePath,
            name:   cfg.gameTitle || 'Unknown Game',
            status: 'loaded',
          })
        }
      } catch (e) {
        console.error('Config load error:', e)
      }
    }
    boot()
  }, [])

  // ── Listen for game exit events ──────────────────────────────────────────
  useEffect(() => {
    electron.game.onExit?.((code) => {
      setGameState(prev => ({ ...prev, status: 'loaded' }))
      notify(`Game exited (code ${code ?? 0})`, 'info')
    })
    electron.game.onError?.((msg) => {
      setGameState(prev => ({ ...prev, status: 'loaded' }))
      notify(`Game error: ${msg}`, 'error')
    })
    // Menu shortcuts
    electron.menu.onLaunchGame?.(() => handleLaunch())
    electron.menu.onOpenSettings?.(() => {
      setActiveView('settings')
      setSidebarTab('settings')
    })
  }, [])

  // ── Game select ──────────────────────────────────────────────────────────
  const handleGameSelect = useCallback(async ({ path, name }) => {
    const newState = { path, name, status: 'loaded' }
    setGameState(newState)
    await electron.config.save({ gamePath: path, gameTitle: name })
  }, [electron])

  // ── Launch ───────────────────────────────────────────────────────────────
  const handleLaunch = useCallback(async () => {
    if (!gameState.path) {
      notify('No game installed — add a game first', 'warn')
      return { success: false, error: 'No game installed' }
    }
    setGameState(prev => ({ ...prev, status: 'running' }))
    const result = await electron.game.launch(gameState.path)
    if (!result?.success) {
      setGameState(prev => ({ ...prev, status: 'loaded' }))
    }
    return result
  }, [gameState.path, electron])

  // ── Clear game ───────────────────────────────────────────────────────────
  const handleClearGame = useCallback(async () => {
    setGameState(INITIAL_GAME_STATE)
    await electron.config.save({ gamePath: null, gameTitle: null })
    notify('Game removed', 'info')
  }, [electron])

  // ── Navigation ───────────────────────────────────────────────────────────
  function handleNavSelect(id) {
    setSidebarTab(id)
    if (id === 'library' || id === 'recent' || id === 'store' || id === 'friends') {
      setActiveView('home')
    }
  }

  function handleTitleNavigation(id) {
    setActiveView(id)
    if (id === 'settings') setSidebarTab('settings')
    else setSidebarTab('library')
  }

  if (loading) {
    return (
      <>
        <LoadingScreen onComplete={() => setLoading(false)} />
        <NotificationStack />
      </>
    )
  }

  return (
    <div style={styles.root}>
      {/* Ambient glow blobs */}
      <div style={styles.ambientTop} />
      <div style={styles.ambientBottom} />

      {/* Main layout */}
      <div style={styles.layout}>
        <TitleBar activeView={activeView} onNavigate={handleTitleNavigation} />

        <div style={styles.body}>
          <Sidebar
            active={sidebarTab}
            onSelect={handleNavSelect}
            gameStatus={gameState.status}
            gameName={gameState.name}
          />

          <main style={styles.main}>
            {activeView === 'home' && (
              <HomeView
                gameState={gameState}
                onGameSelect={handleGameSelect}
                onGameLaunch={handleLaunch}
              />
            )}
            {activeView === 'settings' && (
              <SettingsView
                gameState={gameState}
                onClearGame={handleClearGame}
              />
            )}
          </main>
        </div>

        {/* Status bar */}
        <StatusBar gameState={gameState} isElectron={electron.isElectron} />
      </div>

      <NotificationStack />
    </div>
  )
}

function StatusBar({ gameState, isElectron }) {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const statusColor = {
    idle:    'var(--text-muted)',
    loaded:  'var(--neon-cyan)',
    running: 'var(--status-ok)',
  }[gameState.status] || 'var(--text-muted)'

  const statusText = {
    idle:    'Standby',
    loaded:  `Game Loaded`,
    running: `Running`,
  }[gameState.status] || 'Standby'

  return (
    <div style={styles.statusBar}>
      <div style={styles.statusLeft}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}`, flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.15em', color: statusColor }}>
          {statusText}
        </span>
        {gameState.name && gameState.status !== 'idle' && (
          <>
            <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>—</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>{gameState.name}</span>
          </>
        )}
      </div>
      <div style={styles.statusRight}>
        {!isElectron && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(245,158,11,0.7)', marginRight: '12px' }}>
            ⚠ Browser mode — run in Electron for full features
          </span>
        )}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '8px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>
          KATALIST v1.0.0
        </span>
      </div>
    </div>
  )
}

const styles = {
  root: {
    width: '100vw', height: '100vh',
    display: 'flex', flexDirection: 'column',
    background: 'var(--void)',
    position: 'relative',
    overflow: 'hidden',
  },
  ambientTop: {
    position: 'absolute', top: '-200px', right: '-100px',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  ambientBottom: {
    position: 'absolute', bottom: '-150px', left: '-100px',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6,182,212,0.04), transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  layout: {
    flex: 1, display: 'flex', flexDirection: 'column',
    position: 'relative', zIndex: 1,
    overflow: 'hidden',
  },
  body: {
    flex: 1, display: 'flex',
    overflow: 'hidden',
  },
  main: {
    flex: 1, display: 'flex', flexDirection: 'column',
    overflow: 'hidden', position: 'relative',
  },
  statusBar: {
    height: '26px', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 16px',
    background: 'rgba(4,6,13,0.9)',
    borderTop: '1px solid rgba(124,58,237,0.1)',
    backdropFilter: 'blur(10px)',
  },
  statusLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  statusRight: { display: 'flex', alignItems: 'center', gap: '16px' },
}
