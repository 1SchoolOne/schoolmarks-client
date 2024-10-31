/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		open: true,
	},
	resolve: {
		alias: {
			'@components': path.resolve(__dirname, './src/components'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@types': path.resolve(__dirname, './src/types'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@routes': path.resolve(__dirname, './src/routes'),
			'@contexts': path.resolve(__dirname, './src/contexts'),
		},
	},
	test: {
		dir: 'src',
		globals: true,
	},
})
