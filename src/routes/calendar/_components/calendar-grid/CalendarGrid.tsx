import { Col, Row, Typography } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { CalendarCourses } from '../calendar-courses/CalendarCourses'
import { calculateEventPosition } from '../calendar-courses/CalendarCourses-utils'
import { ICalendarGridProps } from './CalendarGrid-types'
import { getCurrentTimePosition } from './CalendarGrid-utils'

import './CalendarGrid-styles.less'

const { Text } = Typography

export function CalendarGrid(params: ICalendarGridProps) {
	const { events, startHour = 0, endHour = 0, weekDates, hourHeight } = params
	const [currentTimePosition, setCurrentTimePosition] = useState(0)

	useEffect(() => {
		function updateCurrentTime() {
			setCurrentTimePosition(getCurrentTimePosition(startHour, endHour, hourHeight))
		}

		updateCurrentTime()
		const interval = setInterval(updateCurrentTime, 60000)

		return () => clearInterval(interval)
	}, [startHour, endHour])

	const hourLabels = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i)

	const days = ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.']

	const getEventsForDate = (dateInfo: { fullDate: string }) => {
		return events.filter((event) => {
			const eventDate = dayjs(event.date)
			const columnDate = dayjs(dateInfo.fullDate)
			return eventDate.isSame(columnDate, 'day')
		})
	}

	return (
		<div className="calendar-grid">
			<Row justify="end" className="calendar-header">
				{days.map((day, index) => (
					<Col key={day} span={4} className="day-column-header">
						<div className="dates">
							<Text>{day}</Text>
							<Text>{weekDates.dates[index]?.date}</Text>
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
				{weekDates.dates.map((dateInfo) => (
					<Col key={dateInfo.fullDate} span={4} className="day-column">
						<div className="day-grid">
							{hourLabels.map((hour) => (
								<div
									key={`${dateInfo.fullDate}-${hour}`}
									style={{ height: `${hourHeight}px` }}
									className="hour-slot"
								></div>
							))}
							{getEventsForDate(dateInfo).map((event) => (
								<CalendarCourses
									key={`${event.id}-${dateInfo.fullDate}`}
									event={event}
									style={calculateEventPosition(event, startHour, hourHeight)}
								/>
							))}
						</div>
					</Col>
				))}
			</Row>
		</div>
	)
}
