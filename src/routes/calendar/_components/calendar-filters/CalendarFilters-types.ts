import { Dayjs } from 'dayjs'

export interface CalendarFiltersProps {
	currentDate: Dayjs
	monthOptions: React.ReactNode[]
	yearOptions: React.ReactNode[]
	updateCurrentDate: (operation: 'next' | 'prev') => void
	handleMonthSelectChange: (newMonth: number) => void
	handleYearSelectChange: (newYear: number) => void
}
