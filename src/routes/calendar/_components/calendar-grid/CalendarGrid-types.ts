export interface ICalendarEvent {
	id: string
	title: string
	startTime: string
	endTime: string
	classroom: string
	dayIndex: number
	color: string
}

export interface ICalendarGridProps {
	events: ICalendarEvent[]
	startHour?: number
	endHour?: number
	dateRange?: {
		year: number
		month: string
		weekNumber: number
	}
}
