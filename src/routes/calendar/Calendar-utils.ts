import dayjs from 'dayjs'

import { IWeekDates } from './_components/calendar-grid/CalendarGrid-types'

export function getWeekDates(currentDate: dayjs.Dayjs): IWeekDates {
	const firstDayOfMonth = currentDate.startOf('month')
	const weekNumber = Math.ceil((currentDate.date() + firstDayOfMonth.day()) / 7)

	let startOfWeek = currentDate.startOf('week').add(1, 'day').subtract(1, 'day')

	if (weekNumber === 1) {
		if (startOfWeek.month() !== currentDate.month()) {
			startOfWeek = firstDayOfMonth.startOf('week').add(1, 'day').subtract(1, 'day')
		}
	} else {
		startOfWeek = firstDayOfMonth
			.add((weekNumber - 1) * 7, 'day')
			.startOf('week')
			.add(1, 'day')
			.subtract(1, 'day')
	}

	const dates = Array.from({ length: 5 }, (_, index) => {
		const date = startOfWeek.add(index, 'day')
		return {
			date: date.date(),
			month: date.month(),
			year: date.year(),
			dayOfWeek: index,
			fullDate: date.format('YYYY-MM-DD'),
		}
	})

	return {
		weekNumber,
		dates,
		month: currentDate.month(),
		year: currentDate.year(),
	}
}
