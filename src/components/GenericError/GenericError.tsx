import { Button, Result } from 'antd'
import { ArrowLeftIcon } from 'lucide-react'
import { useNavigate, useRouteError } from 'react-router-dom'

export function GenericError() {
	const navigate = useNavigate()
	const routeError = useRouteError() as Error

	return (
		<Result
			status="error"
			title={routeError.message}
			extra={[
				<Button type="link" icon={<ArrowLeftIcon size={16} />} onClick={() => navigate('/app')}>
					Revenir sur SchoolMarks
				</Button>,
			]}
		>
			{routeError.stack && (
				<pre style={{ maxHeight: 350, overflow: 'hidden', overflowY: 'auto' }}>
					{JSON.stringify(routeError.stack, null, 2).replace(/\\n/g, '\n').replace(/"/g, '')}
				</pre>
			)}
		</Result>
	)
}
