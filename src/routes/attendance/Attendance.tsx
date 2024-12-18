import { useQuery } from '@tanstack/react-query'
import { Card, Col, Descriptions, Row, Space, Tag } from 'antd'
import dayjs from 'dayjs'
import { CircleDotIcon, CircleOffIcon } from 'lucide-react'
import { useContext } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'

import { getClassSessions } from '@api/classSessions'

import { LoadingScreen } from '@components'

import { IdentityContext } from '@contexts'

import { attendanceLoader } from '.'

export function Attendance() {
	const initialData = useLoaderData() as Awaited<ReturnType<typeof attendanceLoader>>
	const navigate = useNavigate()
	const { user } = useContext(IdentityContext)

	const { data: classSessions, isPending } = useQuery({
		queryKey: ['classSessions'],
		queryFn: () => getClassSessions(),
		initialData,
	})

	return isPending ? (
		<LoadingScreen />
	) : (
		<Row gutter={[16, 16]}>
			{classSessions.map((session) => {
				const startTime = session.start_time.split(':').slice(0, 2).join(':')
				const endTime = session.end_time.split(':').slice(0, 2).join(':')

				const checkinStarted = !!session.checkin_session
				const checkinClosed = dayjs().isAfter(dayjs(session.checkin_session?.closed_at))

				const checkinLabel = checkinStarted
					? checkinClosed
						? 'Appel fermé'
						: 'Appel en cours'
					: null

				// TODO: remove inline styling
				return (
					<Col key={session.id} span={8}>
						<Card
							title={
								<Space align="center" style={{ justifyContent: 'space-between' }}>
									<div>{session.course?.name}</div>
									{checkinLabel && (
										<Tag
											style={{ display: 'flex', alignItems: 'center', gap: 'var(--ant-margin-xs)' }}
											icon={
												checkinClosed ? <CircleOffIcon size={12} /> : <CircleDotIcon size={12} />
											}
											color={checkinClosed ? 'red' : 'green'}
										>
											{checkinLabel}
										</Tag>
									)}
								</Space>
							}
							bordered={false}
							hoverable={user?.role !== 'student'}
							onClick={() => {
								if (user?.role !== 'student') {
									navigate(`class-session/${session.id}`)
								}
							}}
						>
							<Descriptions
								layout="vertical"
								items={[
									{
										label: 'Date',
										children: dayjs(session.date).format('dddd DD MMMM'),
									},
									{
										label: 'Heure',
										children: `${startTime} - ${endTime}`,
									},
								]}
							/>
						</Card>
					</Col>
				)
			})}
		</Row>
	)
}
