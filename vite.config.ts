import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ['esnext'],
    lib: {
      entry: './src/index.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime'
      ]
      // external(source, importer, isResolved) {
      //   if (~source.indexOf('/node_modules/'))
      //     return true
      // },
    }
  }
})
