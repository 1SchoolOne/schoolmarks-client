import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	Button,
	Col,
	Descriptions,
	Divider,
	Flex,
	Form,
	Modal,
	Progress,
	QRCode,
	Row,
	Space,
	TimePicker,
	Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useContext, useEffect, useRef, useState } from 'react'
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
	const [totpCountdown, setTotpCountdown] = useState(0)
	const [totpExpiresAt, setTotpExpiresAt] = useState(dayjs().add(15, 'seconds'))
	const previousTotp = useRef<string>()

	useEffect(
		function updateCountdown() {
			const interval = setInterval(() => {
				const now = dayjs()
				const timeLeft = totpExpiresAt.diff(now, 'seconds')

				if (timeLeft === 0) {
					clearInterval(interval)
					setTotpCountdown(0)
					return
				}

				setTotpCountdown(totpExpiresAt.diff(now, 'seconds'))
			}, 16.67)

			return () => clearInterval(interval)
		},
		[totpCountdown, totpExpiresAt],
	)

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

	const { data: totp } = useQuery({
		queryKey: ['checkin-session', 'totp', classSession.checkin_session?.id],
		queryFn: async () => {
			const { data } = await axiosInstance.get<{ totp: string }>(
				`/checkin_sessions/${classSession.checkin_session?.id}/totp/`,
			)

			if (previousTotp.current !== data.totp) {
				setTotpExpiresAt(dayjs().add(15.5, 'seconds'))
			}

			previousTotp.current = data.totp

			return data.totp
		},
		refetchInterval: 1000,
		staleTime: 1000,
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
						{totp && (
							<Row className="totp-container" gutter={[8, 8]}>
								<Col span={24}>
									<Flex align="center" justify="center" gap={6}>
										<Typography.Title level={3}>Code :</Typography.Title>
										<Typography.Title level={3}>{totp}</Typography.Title>
									</Flex>
								</Col>
								<Col span={24}>
									<Progress
										percent={(totpCountdown / 15) * 100 + 1}
										format={() => ''}
										strokeColor={
											totpCountdown > 5 ? 'var(--ant-color-info)' : 'var(--ant-color-error)'
										}
									/>
								</Col>
							</Row>
						)}
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
