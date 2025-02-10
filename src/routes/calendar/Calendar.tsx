import { useState } from 'react'

import { CalendarFilters } from './_components/calendar-filters/CalendarFilters'
import { CalendarGrid } from './_components/calendar-grid/CalendarGrid'

import './Calendar-styles.less'

const sampleEvents = [
	{
		id: '1',
		title: 'Mathématiques',
		startTime: '08:00',
		endTime: '11:30',
		classroom: 'Salle A1',
		dayIndex: 0,
		color: '#ff4d4f',
	},
	{
		id: '2',
		title: 'Histoire',
		startTime: '10:00',
		endTime: '11:30',
		classroom: 'Salle B2',
		dayIndex: 2,
		color: '#1890ff',
	},
	{
		id: '3',
		title: 'Physique',
		startTime: '13:00',
		endTime: '15:30',
		classroom: 'Salle C3',
		dayIndex: 4,
		color: '#52c41a',
	},
]

export function Calendar() {
	return (
		<div className="calendar-container">
			<CalendarFilters />
			<CalendarGrid events={sampleEvents} startHour={8} endHour={17} />
		</div>
	)
}
