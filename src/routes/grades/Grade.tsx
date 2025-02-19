import { Alert, Flex, Spin } from 'antd'
import React, { useEffect, useState } from 'react'

import { getSession } from '@api/auth'

import { GradesStudent } from './componants/GradesStudent'
import { GradesTeacher } from './componants/GradesTeacher'

export const Grade: React.FC = () => {
	const [userRole, setUserRole] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchUserSession = async () => {
			try {
				setLoading(true)
				const sessionData = await getSession()
				const user = sessionData.data.user

				if (!user) {
					setError('Utilisateur non connecté')
					return
				}

				setUserRole(user.role)
				console.log('Utilisateur connecté avec le rôle:', user.role)
			} catch (err) {
				console.error('Erreur lors de la récupération de la session:', err)
				setError('Impossible de récupérer les informations de session')
			} finally {
				setLoading(false)
			}
		}

		fetchUserSession()
	}, [])

	if (loading) {
		return (
			<Flex justify="center" align="center" style={{ height: '100vh' }}>
				<Spin size="large" tip="Chargement des données..." />
			</Flex>
		)
	}

	if (error) {
		return (
			<Alert
				message="Erreur"
				description={error}
				type="error"
				showIcon
				style={{ maxWidth: '600px', margin: '20px auto' }}
			/>
		)
	}

	switch (userRole) {
		case 'teacher':
			return <GradesTeacher />
		case 'student':
			return <GradesStudent />
	}
}
