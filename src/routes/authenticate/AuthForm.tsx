import { AuthLayout } from '@1schoolone/ui'
import { Button, Card, Form, Input, Typography } from 'antd'

interface AuthFormValues {
	email?: string
	password?: string
}

export function onSubmit(_values: AuthFormValues) {
	// TODO: implement this function
	return
}

export function AuthForm() {
	const [formInstance] = Form.useForm<AuthFormValues>()

	return (
		<Card title={<Typography.Title>Connexion</Typography.Title>}>
			<Form<AuthFormValues>
				className="auth-form"
				layout="vertical"
				form={formInstance}
				onFinish={onSubmit}
			>
				<Form.Item name="email" label="Email">
					<Input />
				</Form.Item>
				<Form.Item name="password" label="Mot de passe">
					<Input.Password />
				</Form.Item>
				<Button type="primary" htmlType="submit" block>
					Connexion
				</Button>
			</Form>
		</Card>
	)
}

export function Component() {
	return (
		<AuthLayout>
			<AuthForm />
		</AuthLayout>
	)
}
