import { PropsWithChildren } from '@1schoolone/ui'
import { Col, Divider, Flex, Row } from 'antd'
import { ReactNode } from 'react'

import './Calendar-styles.less'

function TimeSlotColumn() {
	return (
		<Row className="hours-column">
			<Col span={24}>
				<Flex className="hours" justify="end" align="start">
					8h
				</Flex>
			</Col>
			<Col span={24}>
				<Flex className="hours" justify="end" align="start">
					9h
				</Flex>
			</Col>
			<Col span={24}>
				<Flex className="hours" justify="end" align="start">
					10h
				</Flex>
			</Col>
			<Col span={24}>
				<Flex className="hours" justify="end" align="start">
					11h
				</Flex>
			</Col>
			<Col span={24}>
				<Flex className="hours" justify="end" align="start">
					12h
				</Flex>
			</Col>
			<Col span={24}>
				<Flex className="hours" justify="end" align="start">
					13h
				</Flex>
			</Col>
			<Col span={24}>
				<Flex className="hours" justify="end" align="start">
					14h
				</Flex>
			</Col>
			<Col span={24}>
				<Flex className="hours" justify="end" align="start">
					15h
				</Flex>
			</Col>
			<Col span={24}>
				<Flex className="hours" justify="end" align="start">
					16h
				</Flex>
			</Col>
			<Col span={24}>
				<Flex className="hours" justify="end" align="start">
					17h
				</Flex>
			</Col>
			<Col span={24}>
				<Flex className="hours" justify="end" align="start">
					18h
				</Flex>
			</Col>
			<Col span={24}>
				<Flex className="hours" justify="end" align="start">
					19h
				</Flex>
			</Col>
		</Row>
	)
}

function Column() {
	return (
		<div
			style={{
				display: 'grid',
				gridAutoRows: 'calc(50px - 4px)',
				height: '100%',
				rowGap: '8px',
			}}
		>
			<TimeSlot
				style={{
					gridRowStart: '1',
					gridRowEnd: '4',
				}}
			>
				Micro Services{'\n'}
				8h00 {'->'} 9h30
			</TimeSlot>
			<TimeSlot
				style={{
					gridRowStart: '4',
					gridRowEnd: '6',
				}}
			>
				Deep Learning{'\n'}
				9h30 {'->'} 10h30
			</TimeSlot>
			<TimeSlot
				style={{
					gridRowStart: '6',
					gridRowEnd: '9',
				}}
			>
				TOTO TEST
			</TimeSlot>
		</div>
	)
}

function TimeSlot({
	children,
	style,
}: PropsWithChildren<{ style: React.CSSProperties | undefined }>) {
	return (
		<div
			style={{
				backgroundColor: 'var(--ant-color-bg-container-disabled)',
				borderRadius: 'var(--ant-border-radius-lg)',
				...style,
			}}
		>
			<div style={{ padding: 'var(--ant-padding-xs)' }}>{children}</div>
		</div>
	)
}

function GridLines() {
	return (
		<div
			style={{
				display: 'grid',
				gridAutoRows: '50px',
				rowGap: '8px',
			}}
		>
			<div style={{ borderBottom: '1px dashed var(--ant-color-bg-text-active)', height: '50px' }} />
			<div style={{ borderBottom: '1px solid var(--ant-color-bg-text-active)', height: '50px' }} />
			<div style={{ borderBottom: '1px dashed var(--ant-color-bg-text-active)', height: '50px' }} />
			<div style={{ borderBottom: '1px solid var(--ant-color-bg-text-active)', height: '50px' }} />
			<div style={{ borderBottom: '1px dashed var(--ant-color-bg-text-active)', height: '50px' }} />
			<div style={{ borderBottom: '1px solid var(--ant-color-bg-text-active)', height: '50px' }} />
			<div style={{ borderBottom: '1px dashed var(--ant-color-bg-text-active)', height: '50px' }} />
			<div style={{ borderBottom: '1px solid var(--ant-color-bg-text-active)', height: '50px' }} />
			<div style={{ borderBottom: '1px dashed var(--ant-color-bg-text-active)', height: '50px' }} />
			<div style={{ borderBottom: '1px solid var(--ant-color-bg-text-active)', height: '50px' }} />
			<div style={{ borderBottom: '1px dashed var(--ant-color-bg-text-active)', height: '50px' }} />
			<div style={{ borderBottom: '1px solid var(--ant-color-bg-text-active)', height: '50px' }} />
			<div style={{ borderBottom: '1px dashed var(--ant-color-bg-text-active)', height: '50px' }} />
			<div style={{ borderBottom: '1px solid var(--ant-color-bg-text-active)', height: '50px' }} />
		</div>
	)
}

function TestLines() {
	const renderLines = (length = 10) => {
		const elems: Array<ReactNode> = []

		for (let i = 0; i < length; i++) {
			elems.push(
				<>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							height: '50px',
							marginTop: i === 0 ? '25px' : 'unset',
						}}
					>
						<Divider variant="dashed" />
					</div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							height: '50px',
						}}
					>
						<Divider />
					</div>
				</>,
			)
		}

		return elems
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '4px',
			}}
		>
			{renderLines(12)}
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
			<Row className="body">
				<Col span={2}>
					<TimeSlotColumn />
				</Col>
				<Col span={4}>
					<TestLines />
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
