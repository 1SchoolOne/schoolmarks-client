import { Flex, Result } from 'antd'
import { useLoaderData } from 'react-router-dom'

import { registerAttendanceLoader } from '.'

export function RegisterAttendance() {
	const loaderData = useLoaderData() as Awaited<ReturnType<typeof registerAttendanceLoader>>

	console.log(loaderData)

	if (!loaderData) {
		return <Result status="error">Une erreur est survenue.</Result>
	}

	return (
		<Flex style={{ height: 'inherit' }} justify="center" align="center">
			<Result
				status="success"
				title="Ta présence a été enregistrée."
				subTitle="Tu as été noté en retard."
			/>
		</Flex>
	)
}
