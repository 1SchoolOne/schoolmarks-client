import { AuthLayout } from '@1schoolone/ui'
import { useMutation } from '@tanstack/react-query'
import { Alert, App, Button, Card, Form, Input, Typography } from 'antd'
import { isAxiosError } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { getToken } from '@api/token'

import { IdentityContext } from '@contexts'

interface AuthFormValues {
	username: string
	password: string
}

export function AuthForm() {
	const [formInstance] = Form.useForm<AuthFormValues>()
	const { setAccessToken, setRefreshToken } = useContext(IdentityContext)
	const [authError, setAuthError] = useState<string>()
	const navigate = useNavigate()

	const { mutate: onSubmitMutation, isPending: isAuthenticating } = useMutation({
		mutationFn: getToken,
		onMutate: () => {
			setAuthError(undefined)
		},
		onSuccess: ({ data: tokens }) => {
			setRefreshToken(tokens.refresh)
			setAccessToken(tokens.access)
			navigate('/attendance', { replace: true })
		},
		onError: (err) => {
			if (isAxiosError(err) && err.status === 401) {
				setAuthError('Utilisateur ou mot de passe incorrect')
			} else {
				setAuthError(err.message)
			}
		},
	})

	return (
		<Card title={<Typography.Title>Connexion</Typography.Title>}>
			{authError && <Alert type="error" message={authError} showIcon />}
			<Form<AuthFormValues>
				className="auth-form"
				layout="vertical"
				form={formInstance}
				onFinish={onSubmitMutation}
			>
				<Form.Item name="username" label="Utilisateur">
					<Input />
				</Form.Item>
				<Form.Item name="password" label="Mot de passe">
					<Input.Password />
				</Form.Item>
				<Button type="primary" htmlType="submit" loading={isAuthenticating} block>
					Connexion
				</Button>
			</Form>
		</Card>
	)
}

export function Component() {
	const [searchParams, setSearchParams] = useSearchParams()
	const { notification } = App.useApp()

	useEffect(() => {
		const notify = searchParams.get('notify')

		if (notify === 'session_expired') {
			notification.info({ message: 'Votre session a expirée', closable: false })

			setSearchParams((prev) => {
				prev.delete('notify')
				return prev
			})
		}
	}, [notification, searchParams, setSearchParams])

	return (
		<AuthLayout heroBackgroundSrc="/brand-mesh-gradient.webp">
			<AuthForm />
		</AuthLayout>
	)
}
