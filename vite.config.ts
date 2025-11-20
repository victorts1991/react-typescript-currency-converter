import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    include: ['**/*.test.ts', '**/*.test.tsx'],
  },
} as UserConfig) 