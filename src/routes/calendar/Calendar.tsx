import { PropsWithChildren } from '@1schoolone/ui'
import { Col, Flex, Row } from 'antd'

import { GridLines } from './_components/GridLines/GridLines'

import './Calendar-styles.less'

function TimeSlotColumn() {
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateRows: 'repeat(22, 50px)',
				height: '100%',
				userSelect: 'none',
			}}
		>
			{[...Array(11)].map((_, i) => {
				const hour = i + 8
				return (
					<div
						key={hour}
						style={{
							gridRowStart: i * 2 + 1,
							padding: '4px',
							textAlign: 'right',
						}}
					>
						<span style={{ display: 'block', transform: 'translateY(-75%)' }}>{hour}h</span>
					</div>
				)
			})}
		</div>
	)
}

function Column() {
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateRows: 'repeat(22, 50px)',
				height: '100%',
				zIndex: 2,
			}}
		>
			<SessionWrapper gridStart={1} gridEnd={4}>
				<TimeSlot>Micro Services</TimeSlot>
			</SessionWrapper>
			<SessionWrapper gridStart={4} gridEnd={6}>
				<TimeSlot>Deep Learning</TimeSlot>
			</SessionWrapper>
		</div>
	)
}

function SessionWrapper(props: PropsWithChildren<{ gridStart: number; gridEnd: number }>) {
	const { children, gridStart, gridEnd } = props

	return (
		<div style={{ gridRowStart: gridStart, gridRowEnd: gridEnd, padding: '4px 0' }}>
			<div style={{ height: '100%' }}>{children}</div>
		</div>
	)
}

function TimeSlot({ children, style }: PropsWithChildren<{ style?: React.CSSProperties }>) {
	return (
		<div
			style={{
				backgroundColor: 'var(--ant-color-bg-container)',
				borderRadius: 'var(--ant-border-radius-lg)',
				height: '100%',
				...style,
			}}
		>
			<div style={{ padding: 'var(--ant-padding-xs)' }}>{children}</div>
		</div>
	)
}

export function Calendar() {
	return (
		<div className="calendar">
			<Row className="header">
				<Col span={4} offset={2}>
					<Flex align="center" justify="center">
						Lundi
					</Flex>
				</Col>
				<Col span={4}>
					<Flex align="center" justify="center">
						Mardi
					</Flex>
				</Col>
				<Col span={4}>
					<Flex align="center" justify="center">
						Mercredi
					</Flex>
				</Col>
				<Col span={4}>
					<Flex align="center" justify="center">
						Jeudi
					</Flex>
				</Col>
				<Col span={4}>
					<Flex align="center" justify="center">
						Vendredi
					</Flex>
				</Col>
			</Row>
			<div className="shade-overlay" />
			<Row className="body hide-scrollbar">
				<GridLines />
				<Col span={2}>
					<TimeSlotColumn />
				</Col>
				<Col span={4}>
					<Column />
				</Col>
				<Col span={4}>
					<Column />
				</Col>
				<Col span={4}>
					<Column />
				</Col>
				<Col span={4}>
					<Column />
				</Col>
				<Col span={4}>
					<Column />
				</Col>
			</Row>
		</div>
	)
}
