import { List as AntdList, Col, Flex, Row, Tag, Typography } from 'antd'
import dayjs from 'dayjs'

import { Student, useData } from './StudentList-data'

export interface ListProps {
	canReadCheckinSessions: boolean
	isCheckInSessionOpened: boolean
	students: Student[]
	isLoading: boolean
}

export function StudentList() {
	const { canReadCheckinSessions, classSession, students, isStudentsPending } = useData()

	return (
		<List
			canReadCheckinSessions={canReadCheckinSessions}
			isCheckInSessionOpened={!!classSession.checkin_session}
			students={students}
			isLoading={isStudentsPending}
		/>
	)
}

export function List(props: ListProps) {
	const { canReadCheckinSessions, isCheckInSessionOpened, students, isLoading } = props

	if (!canReadCheckinSessions) {
		return <></>
	}

	return isCheckInSessionOpened ? (
		<AntdList
			className="student-list"
			itemLayout="horizontal"
			dataSource={students}
			loading={isLoading}
			locale={{
				emptyText: "Aucun élève ne s'est enregistré pour le moment",
			}}
			header={
				<Row gutter={4} align="middle">
					<Col span={13}>
						<Typography.Text strong>Nom</Typography.Text>
					</Col>
					<Col span={5}>
						<Typography.Text strong>Arrivée</Typography.Text>
					</Col>
					<Col span={6}>
						<Typography.Text strong>Statut</Typography.Text>
					</Col>
				</Row>
			}
			renderItem={(item) => {
				const checkedInAt = dayjs(item.checked_in_at)
				const isAbsent = item.status === 'absent'
				const isLate = item.status === 'late'

				return (
					<AntdList.Item className="student-list__item">
						<Row gutter={4} align="middle">
							<Col span={13}>
								<Typography.Text>
									{item.student?.first_name} {item.student?.last_name}
								</Typography.Text>
							</Col>
							<Col span={5}>
								<Typography.Text>{checkedInAt.format('HH:mm')}</Typography.Text>
							</Col>
							<Col span={6}>
								<Tag bordered={false} color={isAbsent ? 'error' : isLate ? 'warning' : 'success'}>
									{isAbsent ? 'Absent' : isLate ? 'En retard' : 'Présent'}
								</Tag>
							</Col>
						</Row>
					</AntdList.Item>
				)
			}}
		/>
	) : (
		<Flex className="no-checkin-session-message" justify="center" align="center">
			<Typography.Text type="secondary">
				La liste s'actualisera une fois l'appel lancé
			</Typography.Text>
		</Flex>
	)
}
