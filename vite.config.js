import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import {viteStaticCopy} from "vite-plugin-static-copy"
import { VitePWA } from "vite-plugin-pwa"


// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '6dc83ca0d743.ngrok-free.app'
    ]
  }
  ,
  plugins: [react(), tailwindcss()
    ,
    viteStaticCopy({
      targets:[
        {
          src: "public/_redirects",
          dest:"."
        }
      ]
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Kretools',
        short_name: 'Mie Ayam Mamey',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
    // require('tailwind-scrollbar-hide')
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
