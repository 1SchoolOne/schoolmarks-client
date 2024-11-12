import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'

import { attendanceRoute } from '@routes/attendance'
import { authenticateRoute } from '@routes/authenticate'
import { calendarRoute } from '@routes/calendar'
import { gradesRoute } from '@routes/grades'

import { MainLayout, ProtectedRoute } from '@components'

import { IdentityProvider } from '@contexts'

import '@1schoolone/ui/dist/index.css'

const routes = createBrowserRouter([
	{
		path: '/',
		element: (
			<IdentityProvider>
				<Outlet />
			</IdentityProvider>
		),
		children: [
			authenticateRoute,
			{
				path: 'app',
				element: (
					<ProtectedRoute>
						<MainLayout>
							<Outlet />
						</MainLayout>
					</ProtectedRoute>
				),
				children: [
					{ path: '/app', element: <Navigate to="/app/attendance" replace /> },
					attendanceRoute,
					gradesRoute,
					calendarRoute,
				],
			},
		],
	},
])

export function App() {
	return <RouterProvider router={routes} />
}
