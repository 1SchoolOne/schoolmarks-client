import { ThemeProvider } from '@1schoolone/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AppProvider } from 'antd'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App.tsx'

import './index.css'

/**
 * Les requêtes mises en cache sont valides pendant 2 minutes. Après ce délai
 * elles sont ré-exécuté au besoin.
 *
 * En mode dev, les requêtes ne sont pas mise en cache.
 */
export const queryClient = new QueryClient({
	defaultOptions: { queries: { staleTime: import.meta.env.DEV ? 0 : 2 * 60 * 1000, retry: false } },
})

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<AppProvider rootClassName="app-container">
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</AppProvider>
		</ThemeProvider>
	</StrictMode>,
)
