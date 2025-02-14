export interface ICalendarEvent {
	id: string
	title: string
	startTime: string
	endTime: string
	classroom: string
	date: string
	color: string
}

export interface IWeekDates {
	weekNumber: number
	dates: {
		date: number
		month: number
		year: number
		dayOfWeek: number
		fullDate: string
	}[]
	month: number
	year: number
}

export interface ICalendarGridProps {
	events: ICalendarEvent[]
	startHour?: number
	endHour?: number
	weekDates: IWeekDates
	hourHeight: number
}
