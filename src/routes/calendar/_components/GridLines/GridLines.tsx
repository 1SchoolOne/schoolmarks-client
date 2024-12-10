import classnames from 'classnames'

import './GridLines-styles.less'

function GridLine({ variant = 'solid' }: { variant?: 'solid' | 'dashed' }) {
	return (
		<div
			className={classnames('grid-line', {
				'grid-line--solid': variant === 'solid',
				'grid-line--dashed': variant === 'dashed',
			})}
		/>
	)
}

export function GridLines() {
	return (
		<div className="calendar__body__grid-lines">
			{[...Array(22)].map((_, i) => (
				<div key={i}>
					<GridLine variant={i % 2 === 0 ? 'solid' : 'dashed'} />
					{/* {i !== 0 && <GridLine variant={i % 2 === 0 ? 'solid' : 'dashed'} />} */}
				</div>
			))}
		</div>
	)
}
