import { useQuery } from '@tanstack/react-query'
import { Col, Modal, QRCode, Row } from 'antd'
import dayjs from 'dayjs'
import { useContext } from 'react'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'

import { getClassSessionQueryOptions } from '@api/classSessions'

import { IdentityContext } from '@contexts'

import { hasPermission } from '@utils/permissions'

import { classSessionloader } from '..'
import { Attendance } from '../Attendance'
import { CheckinSessionForm } from './CheckinSessionForm'
import { StudentList } from './StudentList'
import { TOTPCountdown } from './TOTPCountdown'

import './AttendanceWithModal-styles.less'

export function AttendanceWithModal() {
	const initialData = useLoaderData() as Awaited<ReturnType<typeof classSessionloader>>
	const { user } = useContext(IdentityContext)
	const navigate = useNavigate()
	const params = useParams()
	const canCreateCheckinSessions = hasPermission(user, 'create', 'checkin_sessions')
	const canReadCheckinSessions = hasPermission(user, 'read', 'checkin_sessions')

	const classSessionQueryOptions = getClassSessionQueryOptions(params.classSessionId)

	const { data: classSession } = useQuery({
		...classSessionQueryOptions,
		initialData,
		enabled: typeof params.classSessionId === 'string',
	})

	const sessionDate = dayjs(classSession.date).format('dddd DD MMMM')
	const checkinSessionUrl = `${import.meta.env.VITE_CLIENT_HOST}/register-attendance/${classSession.checkin_session?.id}`

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
				destroyOnClose
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
						<TOTPCountdown />
						<CheckinSessionForm />
					</Col>
					<StudentList />
				</Row>
			</Modal>
		</>
	)
}
