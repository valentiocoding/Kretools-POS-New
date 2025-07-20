import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import {viteStaticCopy} from "vite-plugin-static-copy"

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
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
    })
    // require('tailwind-scrollbar-hide')
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
