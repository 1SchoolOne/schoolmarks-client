import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Select, Space, Typography } from 'antd'

import { IconButton } from '@components'

import { CalendarFiltersProps } from './CalendarFilters-types'

import './CalendarFilters-styles.less'

export function CalendarFilters(props: CalendarFiltersProps) {
	const totalWeeks = Math.ceil(props.currentDate.endOf('month').date() / 7)
	const selectedWeek = Math.min(Math.ceil(props.currentDate.date() / 7), totalWeeks)

	function handleNextWeek() {
		props.updateCurrentDate('next')
	}

	function handlePrevWeek() {
		props.updateCurrentDate('prev')
	}

	return (
		<Space className="calendar-filter-container">
			<div className="calendar-select-date-and-year">
				<Select
					size="small"
					className="month"
					value={props.currentDate.month()}
					onChange={props.handleMonthSelectChange}
				>
					{props.monthOptions}
				</Select>
				<Select
					size="small"
					className="year"
					value={props.currentDate.year()}
					onChange={props.handleYearSelectChange}
				>
					{props.yearOptions}
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
