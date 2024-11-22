import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	Button,
	Col,
	Descriptions,
	Divider,
	Flex,
	Form,
	Modal,
	QRCode,
	Row,
	Space,
	TimePicker,
	Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useContext } from 'react'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'

import { axiosInstance } from '@api/axiosInstance'
import { createCheckinSession } from '@api/checkinSessions'
import { getClassSessionQueryOptions } from '@api/classSessions'

import { IdentityContext } from '@contexts'

import { hasPermission } from '@utils/permissions'

import { classSessionloader } from '..'
import { GetUserByIdResponse } from '../../../types/api/users'
import { Attendance } from '../Attendance'
import { StudentList } from './StudentList'

import './AttendanceWithModal-styles.less'

interface CheckinSessionFormValues {
	startedAt: string
	closedAt: string
}

export function AttendanceWithModal() {
	const initialData = useLoaderData() as Awaited<ReturnType<typeof classSessionloader>>
	const { user } = useContext(IdentityContext)
	const navigate = useNavigate()
	const params = useParams()
	const queryClient = useQueryClient()
	const canCreateCheckinSessions = hasPermission(user, 'create', 'checkin_sessions')
	const canReadCheckinSessions = hasPermission(user, 'read', 'checkin_sessions')

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

	const classSessionQueryOptions = getClassSessionQueryOptions(params.classSessionId)

	const { data: classSession } = useQuery({
		...classSessionQueryOptions,
		initialData,
		enabled: typeof params.classSessionId === 'string',
	})

	const { data: studentList, isPending: isStudentListLoading } = useQuery({
		queryKey: ['checkinStudents', classSession.checkin_session?.id],
		queryFn: async () => {
			const { data } = await axiosInstance.get<
				Array<{
					id: string
					checkin_session: string
					student: GetUserByIdResponse
					checked_in_at: string
					status: string
				}>
			>(`/attendance_records/?checkin_session_id=${classSession.checkin_session?.id}`)

			return data
		},
		refetchInterval: 2_000,
		enabled: !!classSession.checkin_session,
	})

	const sessionDate = dayjs(classSession.date).format('dddd DD MMMM')
	const checkinSessionUrl = `http://${import.meta.env.VITE_API_HOST ?? '127.0.0.1:8000'}/checkin_sessions/${classSession.checkin_session?.id}/`

	return (
		<>
			<Attendance />
			<Modal
				title={`${sessionDate.charAt(0).toUpperCase() + sessionDate.slice(1)} - ${classSession.course?.name} (${classSession.course?.code})`}
				onCancel={() => navigate(-1)}
				footer={null}
				width={canReadCheckinSessions ? 750 : 500}
				open
				centered
			>
				<Row>
					<Col span={canReadCheckinSessions ? 11 : 24}>
						<QRCode
							status={classSession.checkin_session ? 'active' : 'loading'}
							statusRender={({ status }) => {
								if (status === 'loading') {
									return canCreateCheckinSessions
										? "Lancez l'appel pour générer un QR code"
										: "Le QR code sera généré après le lancement de l'appel"
								}
							}}
							type="svg"
							value={checkinSessionUrl}
							size={200}
						/>
						{classSession.checkin_session ? (
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
						) : (
							canCreateCheckinSessions && (
								<Form<CheckinSessionFormValues> layout="vertical" onFinish={submitCheckinSession}>
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
						)}
					</Col>
					{canReadCheckinSessions && (
						<>
							<Col span={2}>
								<Divider type="vertical" style={{ height: '100%' }} />
							</Col>
							<Col span={11}>
								{classSession.checkin_session ? (
									<StudentList
										students={studentList ?? []}
										checkinSession={classSession.checkin_session}
										isLoading={isStudentListLoading}
									/>
								) : (
									<Flex className="no-checkin-session-message" justify="center" align="center">
										<Typography.Text type="secondary">
											La liste s'actualisera une fois l'appel lancé
										</Typography.Text>
									</Flex>
								)}
							</Col>
						</>
					)}
				</Row>
			</Modal>
		</>
	)
}
