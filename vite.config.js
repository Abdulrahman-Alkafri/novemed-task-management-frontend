import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler"],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})