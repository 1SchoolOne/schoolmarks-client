import { useContext } from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

import { MainLayout, ProtectedRoute } from '@components'

import { IdentityContext } from '@contexts'

import { Route } from '@types'

import { attendanceRoute } from './attendance/attendance'
import { authenticateRoute } from './authenticate/authenticate'
import { calendarRoute } from './calendar/calendar'
import { gradesRoute } from './grades/grades'

/**
 * Regroupe toutes les routes de l'application et conditionne l'accès à
 * certaines routes.
 */
export function Routes() {
	const { accessToken } = useContext(IdentityContext)

	/** Routes accessible uniquement lorsque l'utilisateur n'est pas connecté */
	const routesForNonAuthenticatedOnly: Route[] = [authenticateRoute]

	/** Routes accessible uniquement lorsque l'utilisateur est connecté */
	const routesForAuthenticatedOnly: Route[] = [
		{ path: '/', element: <Navigate to="/attendance" /> },
		{
			path: '/',
			element: (
				<ProtectedRoute>
					<MainLayout />
				</ProtectedRoute>
			),
			children: [attendanceRoute, gradesRoute, calendarRoute],
		},
	]

	/**
	 * Les routes "NonAuthenticatedOnly" sont ajoutées au routeur seulement
	 * lorsque l'utilisateur n'est pas connecté
	 */
	const router = createBrowserRouter([
		{ path: '*', element: <Navigate to="/attendance" /> },
		...(!accessToken ? routesForNonAuthenticatedOnly : []),
		...routesForAuthenticatedOnly,
	])

	return <RouterProvider router={router} />
}
