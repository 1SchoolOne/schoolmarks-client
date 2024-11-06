import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

import { attendanceRoute } from '@routes/attendance/attendance'
import { authenticateRoute } from '@routes/authenticate/authenticate'
import { calendarRoute } from '@routes/calendar/calendar'
import { gradesRoute } from '@routes/grades/grades'

import { MainLayout } from '@components'

import '@1schoolone/ui/dist/index.css'

const router = createBrowserRouter([
	// Redirige les requêtes de '/' vers '/attendance'.
	// On ne veut pas de route d'accueil.
	{ path: '/', element: <Navigate to="/attendance" /> },
	{
		path: '/',
		element: <MainLayout />,
		children: [attendanceRoute, gradesRoute, calendarRoute],
	},
	authenticateRoute,
])

export function App() {
	return <RouterProvider router={router} />
}
