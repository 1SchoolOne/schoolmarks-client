import { PropsWithChildren, ThemeProvider } from '@1schoolone/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RenderOptions, render as renderReact } from '@testing-library/react'
import { ReactNode, useMemo } from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import { IdentityProvider } from '@contexts'

const testingQueryClient = new QueryClient({
	defaultOptions: { queries: { staleTime: 0, retry: false } },
})

function AllProviders({ children }: PropsWithChildren) {
	const testingRouter = useMemo(
		() =>
			createMemoryRouter(
				[{ path: '/:classSessionId', element: <IdentityProvider>{children}</IdentityProvider> }],
				{ initialEntries: ['/123'] },
			),
		[children],
	)

	return (
		<ThemeProvider>
			<RouterProvider router={testingRouter} />
		</ThemeProvider>
	)
}

function renderWithQueryClient(
	client: QueryClient,
	ui: React.ReactElement,
	options?: RenderOptions,
): ReturnType<typeof renderReact> {
	const { rerender, ...result } = renderReact(
		<QueryClientProvider client={client}>{ui}</QueryClientProvider>,
		options,
	)

	return {
		...result,
		rerender: (rerenderUi: React.ReactNode) =>
			rerender(<QueryClientProvider client={client}>{rerenderUi}</QueryClientProvider>),
	}
}

export function renderWithProviders(elements: ReactNode, options?: RenderOptions) {
	return renderWithQueryClient(testingQueryClient, <AllProviders>{elements}</AllProviders>, options)
}
