import { useQuery } from '@tanstack/react-query'
import { Avatar, Button, Col, List, Modal, QRCode, Row } from 'antd'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'

import { getCourse } from '@api/courses'

import { classSessionloader } from '.'
import { Attendance } from '../Attendance'

export function AttendanceWithModal() {
	const initialCourse = useLoaderData() as Awaited<ReturnType<typeof classSessionloader>>
	const navigate = useNavigate()
	const params = useParams()

	const { data: course } = useQuery({
		queryKey: ['courses', params.courseId],
		queryFn: () => getCourse(String(params.courseId)),
		initialData: initialCourse,
		enabled: typeof params.courseId === 'string',
	})

	return (
		<>
			<Attendance />
			<Modal
				title={`Lundi 6 Septembre - ${course.name} (${course.code})`}
				onCancel={() => navigate(-1)}
				footer={null}
				open
				centered
			>
				<Row>
					<Col span={12}>
						<QRCode type="svg" value="https://www.youtube.com/watch?v=opBFaCS_PV4" size={200} />
						<Button type="primary">Lancer l'appel</Button>
					</Col>
					<Col span={12}>
						<List
							itemLayout="horizontal"
							dataSource={[
								{ initials: 'IY', name: 'Ilhan YAPICI' },
								{ initials: 'MP', name: 'Maxime PRIOLEAU' },
								{ initials: 'MD', name: 'Mathieu DA MOTA LONGO' },
								{ initials: 'NO', name: 'Nicolas OLIVIER' },
							]}
							renderItem={(item) => (
								<List.Item>
									<List.Item.Meta
										avatar={<Avatar>{item.initials}</Avatar>}
										title={item.name}
										description="Arrivé à 9h05"
									/>
								</List.Item>
							)}
						/>
					</Col>
				</Row>
			</Modal>
		</>
	)
}
