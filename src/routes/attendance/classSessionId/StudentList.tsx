import { useQuery } from '@tanstack/react-query'
import { Col, Divider, Flex, List, Row, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { useContext } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'

import { axiosInstance } from '@api/axiosInstance'
import { getClassSessionQueryOptions } from '@api/classSessions'

import { IdentityContext } from '@contexts'

import { hasPermission } from '@utils/permissions'

import { classSessionloader } from '..'
import { GetUserByIdResponse } from '../../../types/api/users'

export function StudentList() {
	const initialData = useLoaderData() as Awaited<ReturnType<typeof classSessionloader>>
	const { user } = useContext(IdentityContext)
	const params = useParams()
	const canReadCheckinSessions = hasPermission(user, 'read', 'checkin_sessions')

	const classSessionQueryOptions = getClassSessionQueryOptions(params.classSessionId)

	const { data: classSession } = useQuery({
		...classSessionQueryOptions,
		initialData,
		enabled: typeof params.classSessionId === 'string',
	})

	const { data: students, isPending } = useQuery({
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
		select: (data) => {
			if (Array.isArray(data)) {
				return data
			}

			return [data]
		},
		refetchInterval: 2_000,
		enabled: !!classSession.checkin_session,
	})

	if (!canReadCheckinSessions) {
		return <></>
	}

	// TODO: remove inline styling
	return (
		<>
			<Col span={2}>
				<Divider type="vertical" style={{ height: '100%' }} />
			</Col>
			<Col span={11}>
				{classSession.checkin_session ? (
					<List
						className="student-list"
						itemLayout="horizontal"
						dataSource={students}
						loading={isPending}
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
							const isAbsent = checkedInAt > dayjs(classSession.checkin_session?.closed_at)
							const isLate = checkedInAt > dayjs(classSession.checkin_session?.started_at)

							return (
								<List.Item className="student-list__item">
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
											<Tag
												bordered={false}
												color={isAbsent ? 'error' : isLate ? 'warning' : 'success'}
											>
												{isAbsent ? 'Absent' : isLate ? 'En retard' : 'Présent'}
											</Tag>
										</Col>
									</Row>
								</List.Item>
							)
						}}
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
	)
}
