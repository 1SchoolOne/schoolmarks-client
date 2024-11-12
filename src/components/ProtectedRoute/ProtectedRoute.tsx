import { PropsWithChildren } from '@1schoolone/ui'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'

import { IdentityContext } from '@contexts'

import { LoadingScreen } from '../LoadingScreen/LoadingScreen'

/**
 * La `ProtectedRoute` permet de restreindre l'accès à une ou plusieurs routes
 * seulement aux utilisateurs authentifié.
 *
 * Redirige automatiquement vers la page de connexion lors du logout.
 */
export function ProtectedRoute({ children }: PropsWithChildren) {
	const { status } = useContext(IdentityContext)

	if (status === 'authenticated') {
		return children
	} else if (status === 'unreachable' || status === null) {
		return <Navigate to="/authenticate" replace />
	} else {
		return <LoadingScreen />
	}
}
