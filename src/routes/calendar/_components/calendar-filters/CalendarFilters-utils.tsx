import { Select } from 'antd'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'

export function useCalendar() {
	const [currentDate, setCurrentDate] = useState(dayjs())
	const currentYear = dayjs().year()

	const years = useMemo(
		() => Array.from({ length: 7 }, (_, i) => currentYear - 1 + i),
		[currentYear],
	)

	const firstDayOfMonth = currentDate.clone().startOf('month')
	const lastDayOfMonth = currentDate.clone().endOf('month')

	const updateCurrentDate = useCallback((operation: 'next' | 'prev') => {
		setCurrentDate((currentDate) => {
			let newDate = currentDate.clone()
			const firstDayOfMonth = newDate.startOf('month')
			const currentWeekIndex = Math.floor(newDate.diff(firstDayOfMonth, 'day') / 7) + 1
			const totalWeeks = Math.ceil(newDate.endOf('month').date() / 7)

			if (operation === 'next') {
				if (currentWeekIndex >= totalWeeks) {
					newDate = newDate.add(1, 'month').startOf('month')
				} else {
					newDate = newDate.add(7, 'day')
				}
			} else {
				if (currentWeekIndex === 1) {
					const previousMonth = newDate.subtract(1, 'month')
					const lastWeekOfPreviousMonth = Math.ceil(previousMonth.endOf('month').date() / 7)
					newDate = previousMonth.startOf('month').add((lastWeekOfPreviousMonth - 1) * 7, 'day')
				} else {
					newDate = newDate.subtract(7, 'day')
				}
			}
			return newDate
		})
	}, [])

	const monthOptions = useMemo(() => {
		return Array.from({ length: 12 }, (_, i) => {
			const month = currentDate.locale('fr').month(i).format('MMMM')
			return (
				<Select.Option key={i} value={i}>
					{month}
				</Select.Option>
			)
		})
	}, [currentDate])

	const yearOptions = useMemo(() => {
		return years.map((year) => (
			<Select.Option key={year} value={String(year)}>
				{year}
			</Select.Option>
		))
	}, [years])

	const handleMonthSelectChange = useCallback((newMonth: number) => {
		setCurrentDate((current) => current.clone().month(newMonth))
	}, [])

	const handleYearSelectChange = useCallback((newYear: number) => {
		setCurrentDate((current) => current.clone().year(newYear))
	}, [])

	return {
		currentDate,
		firstDayOfMonth,
		lastDayOfMonth,
		monthOptions,
		yearOptions,
		updateCurrentDate,
		handleMonthSelectChange,
		handleYearSelectChange,
	}
}
