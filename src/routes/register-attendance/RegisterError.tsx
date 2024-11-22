import { Button, Result } from 'antd'
import { isAxiosError } from 'axios'
import { ArrowLeftIcon } from 'lucide-react'
import { useNavigate, useRouteError } from 'react-router-dom'

export function RegisterError() {
	const navigate = useNavigate()
	const routeError = useRouteError()
	let error = routeError

	if (isAxiosError(routeError) && routeError.response?.data.message) {
		error = routeError.response?.data.message
	}

	return (
		<Result
			status="error"
			title="Erreur lors de l'enregistrement de présence"
			extra={[
				<Button type="link" icon={<ArrowLeftIcon size={16} />} onClick={() => navigate('/app')}>
					Retour à l'application
				</Button>,
			]}
		>
			{String(error)}
		</Result>
	)
}
