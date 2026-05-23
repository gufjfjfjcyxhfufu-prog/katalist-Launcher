// Safe bridge: works in both Electron and regular browser
const isElectron = typeof window !== 'undefined' && window.katalist?.isElectron

export const useElectron = () => {
  const api = isElectron ? window.katalist : null

  return {
    isElectron: !!api,

    window: {
      minimize: () => api?.window.minimize(),
      maximize: () => api?.window.maximize(),
      close:    () => api?.window.close()
    },

    config: {
      load:  async ()       => api ? await api.config.load() : JSON.parse(localStorage.getItem('katalist-config') || '{}'),
      save:  async (data)   => {
        if (api) return await api.config.save(data)
        localStorage.setItem('katalist-config', JSON.stringify(data))
        return { success: true }
      }
    },

    dialog: {
      pickGame: async () => {
        if (api) return await api.dialog.pickGame()
        // Browser fallback: file input
        return new Promise((resolve) => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = '.exe,.app,.sh'
          input.onchange = (e) => {
            const file = e.target.files[0]
            if (file) resolve({ path: file.path || file.name, name: file.name.replace(/\.[^.]+$/, '') })
            else resolve(null)
          }
          input.click()
        })
      }
    },

    game: {
      launch: async (gamePath) => {
        if (api) return await api.game.launch(gamePath)
        return { success: false, error: 'Game launching requires Electron runtime.' }
      },
      kill: async () => {
        if (api) return await api.game.kill()
        return { success: false }
      },
      onError: (cb) => api?.game.onError(cb),
      onExit:  (cb) => api?.game.onExit(cb)
    },

    shell: {
      showItem: async (filePath) => {
        if (api) return await api.shell.showItem(filePath)
      }
    },

    menu: {
      onLaunchGame:  (cb) => api?.menu.onLaunchGame(cb),
      onOpenSettings: (cb) => api?.menu.onOpenSettings(cb)
    }
  }
}
