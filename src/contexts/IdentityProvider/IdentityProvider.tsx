import { PropsWithChildren } from '@1schoolone/ui'
import { createContext, useEffect, useMemo, useState } from 'react'

import { axiosInstance } from '@api/axiosInstance'

import { localStorage } from '@utils/localStorage'

interface IdentityContextState {
	accessToken: string | null
	refreshToken: string | null
}

interface IdentityContextSetters {
	setAccessToken: (token: string | null) => void
	setRefreshToken: (token: string | null) => void
}

type Context = IdentityContextState & IdentityContextSetters

export const IdentityContext = createContext<Context>(null!)

/**
 * Met à disposition les tokens d'accès et de rafraîchissement à travers
 * l'application. Gère la mise à jour des tokens dans le localStorage.
 */
export function IdentityProvider({ children }: PropsWithChildren) {
	const [accessToken, setAccessToken] = useState(localStorage.get('accessToken'))
	const [refreshToken, setRefreshToken] = useState(localStorage.get('refreshToken'))

	useEffect(() => {
		if (accessToken && refreshToken) {
			axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
			localStorage.setAll({ accessToken, refreshToken })
		} else {
			delete axiosInstance.defaults.headers.common['Authorization']
			localStorage.setAll({ accessToken: null, refreshToken: null })
		}
	}, [accessToken, refreshToken])

	const contextValue: Context = useMemo(
		() => ({
			accessToken,
			refreshToken,
			setAccessToken,
			setRefreshToken,
		}),
		[accessToken, refreshToken, setAccessToken, setRefreshToken],
	)

	return <IdentityContext.Provider value={contextValue}>{children}</IdentityContext.Provider>
}
