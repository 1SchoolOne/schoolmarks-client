import { Typography } from 'antd'

import { CalendarCourseProps } from './CalendarCourses-types'

import './CalendarCourses-styles.less'

const { Text } = Typography

export function CalendarCourses({ event, style }: CalendarCourseProps) {
	return (
		<div style={style} className="event-card">
			<Text>{event.title}</Text>
			{event.classroom && <Text className="text-xs">{event.classroom}</Text>}
			<Text className="text-xs">{`${event.startTime} - ${event.endTime}`}</Text>
		</div>
	)
}
