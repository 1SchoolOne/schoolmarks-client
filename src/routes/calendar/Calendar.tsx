import { useMemo } from 'react'

import { getWeekDates } from './Calendar-utils'
import { CalendarFilters } from './_components/calendar-filters/CalendarFilters'
import { useCalendar } from './_components/calendar-filters/CalendarFilters-utils'
import { CalendarGrid } from './_components/calendar-grid/CalendarGrid'

const sampleEvents = [
	{
		id: '1',
		title: 'Mathématiques',
		startTime: '08:00',
		endTime: '11:30',
		classroom: 'Salle A1',
		date: '2025-02-17',
		color: '#ff4d4f',
	},
	{
		id: '2',
		title: 'Histoire',
		startTime: '10:00',
		endTime: '11:30',
		classroom: 'Salle B2',
		date: '2025-02-13',
		color: '#1890ff',
	},
	{
		id: '3',
		title: 'Physique',
		startTime: '11:30',
		endTime: '15:30',
		classroom: 'Salle C3',
		date: '2025-02-13',
		color: '#52c41a',
	},
]

export function Calendar() {
	const {
		currentDate,
		monthOptions,
		yearOptions,
		updateCurrentDate,
		handleMonthSelectChange,
		handleYearSelectChange,
	} = useCalendar()

	const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate])

	return (
		<div>
			<CalendarFilters
				currentDate={currentDate}
				monthOptions={monthOptions}
				yearOptions={yearOptions}
				updateCurrentDate={updateCurrentDate}
				handleMonthSelectChange={handleMonthSelectChange}
				handleYearSelectChange={handleYearSelectChange}
			/>
			<CalendarGrid
				events={sampleEvents}
				startHour={8}
				endHour={17}
				weekDates={weekDates}
				hourHeight={53}
			/>
		</div>
	)
}
