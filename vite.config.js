import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// The Ticketmaster Discovery API does not send permissive CORS headers and is
// meant to be called server-side, so we proxy it through the Vite dev server.
// This also keeps the API key out of the client bundle: the browser calls the
// relative path `/tm/...` with no key, and the proxy injects `apikey` here.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const tmKey = env.TICKETMASTER_API_KEY || env.VITE_TICKETMASTER_API_KEY || ''

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/tm': {
          target: 'https://app.ticketmaster.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/tm/, '/discovery/v2'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (!tmKey) return
              const sep = proxyReq.path.includes('?') ? '&' : '?'
              proxyReq.path += `${sep}apikey=${encodeURIComponent(tmKey)}`
            })
          },
        },
      },
    },
  }
})
