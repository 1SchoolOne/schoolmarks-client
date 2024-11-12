import { MainLayout as Main, PropsWithChildren } from '@1schoolone/ui'
import { CalendarDays, Clock, ScrollText } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import { Link, UserMenu } from '@components'

import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs'

export function MainLayout({ children }: PropsWithChildren) {
	const location = useLocation()

	return (
		<Main
			header={
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Breadcrumbs />
					<UserMenu />
				</div>
			}
			sidebarMenuProps={{
				selectedKeys: location.pathname.split('/').filter((i) => i),
				items: [
					{
						key: 'attendance',
						label: <Link to="/app/attendance">Assiduité</Link>,
						icon: <Clock size={16} />,
					},
					{
						key: 'grades',
						label: <Link to="/app/grades">Notes</Link>,
						icon: <ScrollText size={16} />,
					},
					{
						key: 'calendar',
						label: <Link to="/app/calendar">Calendrier</Link>,
						icon: <CalendarDays size={16} />,
					},
				],
			}}
		>
			{children}
		</Main>
	)
}
