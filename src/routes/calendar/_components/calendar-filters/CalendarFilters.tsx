import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Select, Space, Typography } from 'antd'

import { IconButton } from '@components'

import { useCalendar } from './CalendarFilters-utils'

import './CalendarFilters-styles.less'

export function CalendarFilters() {
	const {
		currentDate,
		monthOptions,
		yearOptions,
		updateCurrentDate,
		handleMonthSelectChange,
		handleYearSelectChange,
	} = useCalendar()

	const totalWeeks = Math.ceil(currentDate.endOf('month').date() / 7)
	const selectedWeek = Math.min(Math.ceil(currentDate.date() / 7), totalWeeks)

	function handleNextWeek() {
		updateCurrentDate('next')
	}

	function handlePrevWeek() {
		updateCurrentDate('prev')
	}

	return (
		<Space className="calendar-filter-container">
			<div className="calendar-select-date-and-year">
				<Select
					size="small"
					className="month"
					value={currentDate.month()}
					onChange={handleMonthSelectChange}
				>
					{monthOptions}
				</Select>
				<Select
					size="small"
					className="year"
					value={currentDate.year()}
					onChange={handleYearSelectChange}
				>
					{yearOptions}
				</Select>
			</div>
			<div className="switch-week-by-week">
				<IconButton icon={<LeftOutlined />} onClick={handlePrevWeek} />
				<Typography.Text>
					Semaine <span>{selectedWeek}</span>
				</Typography.Text>
				<IconButton icon={<RightOutlined />} onClick={handleNextWeek} />
			</div>
		</Space>
	)
}
