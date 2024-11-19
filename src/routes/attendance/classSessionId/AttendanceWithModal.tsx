import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	Avatar,
	Button,
	Col,
	Descriptions,
	Divider,
	Form,
	List,
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
import { getClassSession } from '@api/classSessions'

import { IdentityContext } from '@contexts'

import { classSessionloader } from '..'
import { GetAttendanceRecordsResponse } from '../../../types/api/attendanceRecords'
import { GetUserByIdResponse } from '../../../types/api/users'
import { Attendance } from '../Attendance'

import './AttendanceWithModal-styles.less'

interface CheckinSessionFormValues {
	startedAt: string
	closedAt: string
}

// TODO: hide QR code if the checkin session is closed
export function AttendanceWithModal() {
	const initialData = useLoaderData() as Awaited<ReturnType<typeof classSessionloader>>
	const { user } = useContext(IdentityContext)
	const navigate = useNavigate()
	const params = useParams()
	const queryClient = useQueryClient()

	const { mutate: submitCheckinSession } = useMutation({
		mutationFn: (values: CheckinSessionFormValues) =>
			createCheckinSession({
				class_session: String(classSession.id),
				started_at: values.startedAt,
				closed_at: values.closedAt,
				created_by: user?.id,
				qr_token: crypto.randomUUID(),
				status: 'active',
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['classSession', params.classSessionId] })
		},
	})

	const { data: classSession } = useQuery({
		queryKey: ['classSession', params.classSessionId],
		queryFn: () => getClassSession(String(params.classSessionId)),
		initialData,
		enabled: typeof params.classSessionId === 'string',
	})

	const { data: studentList } = useQuery({
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
			>(`/attendance_records?=checkin_session_id=${classSession.checkin_session?.id}/`)

			return data
		},
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
				width={750}
				open
				centered
			>
				<Row>
					<Col span={11}>
						<QRCode
							status={classSession.checkin_session ? 'active' : 'loading'}
							statusRender={({ status }) => {
								if (status === 'loading') {
									return <>Lancez l'appel pour générer un QR code</>
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
						)}
					</Col>
					<Col span={2}>
						<Divider type="vertical" style={{ height: '100%' }} />
					</Col>
					<Col span={11}>
						<List
							itemLayout="horizontal"
							dataSource={studentList}
							renderItem={(item) => {
								const checkedInAt = dayjs(item.checked_in_at)
								const isAbsent = checkedInAt > dayjs(classSession.checkin_session?.closed_at)
								const isLate = checkedInAt > dayjs(classSession.checkin_session?.started_at)

								return (
									<List.Item>
										<List.Item.Meta
											title={item.student.username}
											description={
												<Typography.Text
													type={isAbsent ? 'danger' : isLate ? 'warning' : undefined}
												>{`Arrivé(e) à ${checkedInAt.format('HH:mm')}`}</Typography.Text>
											}
										/>
									</List.Item>
								)
							}}
						/>
					</Col>
				</Row>
			</Modal>
		</>
	)
}
