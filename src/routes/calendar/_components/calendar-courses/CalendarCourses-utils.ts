import { ICalendarEvent } from '../calendar-grid/CalendarGrid-types'

export function calculateEventPosition(event: ICalendarEvent, startHour: number) {
	const [startHours = 0, startMinutes = 0] = event.startTime.split(':').map(Number)
	const [endHours = 0, endMinutes = 0] = event.endTime.split(':').map(Number)

	const eventStart = startHours * 60 + startMinutes - startHour * 60
	const eventEnd = endHours * 60 + endMinutes - startHour * 60
	const eventDuration = eventEnd - eventStart

	const topPosition = (eventStart / 60) * 53
	const height = (eventDuration / 60) * 53

	return {
		position: 'absolute' as const,
		top: `${topPosition}px`,
		height: `${height}px`,
		marginLeft: `10px`,
		width: '90%',
		backgroundColor: event.color || '#ffd591',
		borderRadius: '4px',
		padding: '8px',
		overflow: 'hidden',
	}
}
