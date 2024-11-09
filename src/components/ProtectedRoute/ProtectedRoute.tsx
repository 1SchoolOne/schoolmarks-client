import { PropsWithChildren } from '@1schoolone/ui'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'

import { IdentityContext } from '@contexts'

/**
 * La `ProtectedRoute` permet de restreindre l'accès à une ou plusieurs routes
 * seulement aux utilisateurs authentifié.
 *
 * Redirige automatiquement vers la page de connexion lors du logout.
 */
export function ProtectedRoute({ children }: PropsWithChildren) {
	const { accessToken } = useContext(IdentityContext)

	if (!accessToken) {
		return <Navigate to="/authenticate" />
	}

	return children
}
