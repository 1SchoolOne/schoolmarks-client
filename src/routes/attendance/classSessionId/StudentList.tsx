import { List, Typography } from 'antd'
import dayjs from 'dayjs'

import { AttendanceRecord } from '../../../types/api/attendanceRecords'
import { CheckinSession } from '../../../types/api/checkinSessions'

export interface StudentListProps {
	students: Array<AttendanceRecord>
	checkinSession: CheckinSession
	isLoading: boolean
}

export function StudentList(props: StudentListProps) {
	const { students, checkinSession, isLoading } = props

	return (
		<List
			itemLayout="horizontal"
			dataSource={students}
			loading={isLoading}
			locale={{
				emptyText: "Aucun élève ne s'est enregistré pour le moment",
			}}
			renderItem={(item) => {
				const checkedInAt = dayjs(item.checked_in_at)
				const isAbsent = checkedInAt > dayjs(checkinSession.closed_at)
				const isLate = checkedInAt > dayjs(checkinSession.started_at)

				return (
					<List.Item>
						<List.Item.Meta
							title={`${item.student?.first_name} ${item.student?.last_name}`}
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
	)
}
