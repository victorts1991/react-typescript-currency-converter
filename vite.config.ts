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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/hooks/**/*.{ts,tsx}'],
      exclude: [
        'src/hooks/**/*.test.{ts,tsx}',
        'src/hooks/**/*.spec.{ts,tsx}',
        'node_modules/',
      ],
      lines: 80,
      functions: 80,
      statements: 80,
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80
      }
    }
  },
} as UserConfig)