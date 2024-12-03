import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Col, Descriptions, Form, Row, Space, TimePicker } from 'antd'
import dayjs from 'dayjs'
import { useContext } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'

import { createCheckinSession } from '@api/checkinSessions'
import { getClassSessionQueryOptions } from '@api/classSessions'

import { IdentityContext } from '@contexts'

import { hasPermission } from '@utils/permissions'

import { classSessionloader } from '..'

interface CheckinSessionFormValues {
	startedAt: string
	closedAt: string
}

export function CheckinSessionForm() {
	const initialData = useLoaderData() as Awaited<ReturnType<typeof classSessionloader>>
	const { user } = useContext(IdentityContext)
	const canCreateCheckinSessions = hasPermission(user, 'create', 'checkin_sessions')
	const queryClient = useQueryClient()
	const params = useParams()

	const classSessionQueryOptions = getClassSessionQueryOptions(params.classSessionId)

	const { data: classSession } = useQuery({
		...classSessionQueryOptions,
		initialData,
		enabled: typeof params.classSessionId === 'string',
	})

	const { mutate: submitCheckinSession } = useMutation({
		mutationFn: (values: CheckinSessionFormValues) => {
			if (!canCreateCheckinSessions) {
				throw Error("Impossible de lancer l'appel")
			}

			return createCheckinSession({
				class_session: String(classSession.id),
				started_at: values.startedAt,
				closed_at: values.closedAt,
				created_by: user!.id,
				qr_token: crypto.randomUUID(),
				status: 'active',
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['classSession', params.classSessionId] })
			queryClient.invalidateQueries({ queryKey: ['classSessions'] })
		},
		onError: console.error,
	})

	if (classSession.checkin_session) {
		// TODO: rethink the display of these datas
		return (
			<Space>
				<Descriptions
					layout="vertical"
					items={[
						{
							label: 'En retard à partir de',
							children: dayjs(classSession.checkin_session?.started_at).format('HH:mm'),
						},
						{
							label: 'Ferme à',
							children: dayjs(classSession.checkin_session?.closed_at).format('HH:mm'),
						},
					]}
				/>
			</Space>
		)
	}

	if (canCreateCheckinSessions) {
		return (
			<Form<CheckinSessionFormValues>
				layout="vertical"
				onFinish={submitCheckinSession}
				preserve={false}
			>
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<Form.Item label="En retard à partir de :" name="startedAt">
							<TimePicker placeholder="HH:mm" format="HH:mm" minuteStep={5} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label="Ferme à :" name="closedAt">
							<TimePicker placeholder="HH:mm" format="HH:mm" minuteStep={5} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Button type="primary" htmlType="submit" block>
							Lancer l'appel
						</Button>
					</Col>
				</Row>
			</Form>
		)
	}

	return <></>
}
