import { Col, Row, Typography } from 'antd'
import { useEffect, useState } from 'react'

import { CalendarCourses } from '../calendar-courses/CalendarCourses'
import { calculateEventPosition } from '../calendar-courses/CalendarCourses-utils'
import { ICalendarGridProps } from './CalendarGrid-types'
import { getCurrentTimePosition } from './CalendarGrid-utils'

import './CalendarGrid-styles.less'

const { Text } = Typography

export function CalendarGrid({
	events,
	startHour = 0,
	endHour = 0,
	dateRange,
}: ICalendarGridProps) {
	const [currentTimePosition, setCurrentTimePosition] = useState(0)

	useEffect(() => {
		function updateCurrentTime() {
			setCurrentTimePosition(getCurrentTimePosition(startHour, endHour))
		}

		updateCurrentTime()
		const interval = setInterval(updateCurrentTime, 60000)

		return () => clearInterval(interval)
	}, [startHour, endHour])

	const hourLabels = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i)

	const days = ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.']

	return (
		<div className="calendar-grid">
			<Row justify="end" className="calendar-header">
				{days.map((day, index) => (
					<Col key={day} span={4} className="day-column-header">
						<div>
							<Text>{day}</Text>
							{dateRange && <Text>{dateRange.weekNumber * 7 + index + 1}</Text>}
						</div>
					</Col>
				))}
			</Row>
			<Row className="calendar-body">
				{currentTimePosition >= 0 && (
					<div className="current-time-line" style={{ top: `${currentTimePosition}px` }} />
				)}
				<Col span={4} className="time-column">
					{hourLabels.map((hour) => (
						<div key={hour} className="hour-label">
							{`${hour}h`}
						</div>
					))}
				</Col>
				{Array.from({ length: 5 }).map((_, dayIndex) => (
					<Col key={`day-${dayIndex}`} span={4} className="day-column">
						<div className="day-grid">
							{hourLabels.map((hour) => (
								<div key={`${dayIndex}-${hour}`} className="hour-slot"></div>
							))}
							{events
								.filter((event) => event.dayIndex === dayIndex)
								.map((event) => (
									<CalendarCourses
										key={event.id}
										event={event}
										style={calculateEventPosition(event, startHour)}
									/>
								))}
						</div>
					</Col>
				))}
			</Row>
		</div>
	)
}
