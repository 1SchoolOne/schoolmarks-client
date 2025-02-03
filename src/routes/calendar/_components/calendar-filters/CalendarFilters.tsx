import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Select, Space, Typography } from 'antd'

import { IconButton } from '@components'

import './CalendarFilters-styles.less'

export function CalendarFilters() {
	return (
		<Space className="calendar-filter-container">
			<div className="calendar-select-date-and-year">
				<Select size="small"></Select>
				<Select size="small"></Select>
			</div>
			<div className="switch-week-by-week">
				<IconButton icon={<LeftOutlined />} />
				<Typography.Text>
					Semaine <span>1</span>
				</Typography.Text>
				<IconButton icon={<RightOutlined />} />
			</div>
		</Space>
	)
}
