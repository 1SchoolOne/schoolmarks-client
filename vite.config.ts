/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd())

	return {
		plugins: [react()],
		server: {
			host: true,
			port: 8080,
			strictPort: true,
			origin: 'http://0.0.0.0:8080',
		},
		preview: {
			port: 8080,
			strictPort: true,
		},
		resolve: {
			alias: {
				'@components': path.resolve(__dirname, './src/components'),
				'@utils': path.resolve(__dirname, './src/utils'),
				'@types': path.resolve(__dirname, './src/types'),
				'@assets': path.resolve(__dirname, './src/assets'),
				'@routes': path.resolve(__dirname, './src/routes'),
				'@contexts': path.resolve(__dirname, './src/contexts'),
				'@api': path.resolve(__dirname, './src/api'),
				'@helpers': path.resolve(__dirname, './src/helpers'),
			},
		},
		build: { outDir: 'build' },
		css: {
			preprocessorOptions: {
				less: {
					javascriptEnabled: true,
				},
			},
		},
		test: {
			dir: 'src',
			globals: true,
			reporters: process.env.CI ? ['basic', 'html', 'github-actions'] : ['basic'],
			outputFile: {
				html: '.vitest-report/index.html',
			},
		},
		define: {
			VITE_API_HOST: JSON.stringify(env.VITE_API_HOST),
			VITE_CLIENT_HOST: JSON.stringify(env.VITE_CLIENT_HOST),
		},
	}
})
