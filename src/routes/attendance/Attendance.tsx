import { useQuery } from '@tanstack/react-query'
import { Button, Space } from 'antd'
import { useLoaderData, useNavigate } from 'react-router-dom'

import { getCourses } from '@api/courses'

import { attendanceLoader } from '.'

export function Attendance() {
	const initialCourses = useLoaderData() as Awaited<ReturnType<typeof attendanceLoader>>
	const navigate = useNavigate()

	const { data: courses } = useQuery({
		queryKey: ['courses'],
		queryFn: getCourses,
		initialData: initialCourses,
	})

	return (
		<Space direction="vertical">
			<Space>
				{courses.map((course) => (
					<Button key={course.code} type="link" onClick={() => navigate(`course/${course.id}`)}>
						{course.name} ({course.code})
					</Button>
				))}
			</Space>
		</Space>
	)
}
