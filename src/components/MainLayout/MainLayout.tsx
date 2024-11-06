import { MainLayout as Main } from '@1schoolone/ui'
import { CalendarDays, Clock, ScrollText } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'

import { Link, UserMenu } from '@components'

import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs'

export function MainLayout() {
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
						label: <Link to="/attendance">Assiduité</Link>,
						icon: <Clock size={16} />,
					},
					{
						key: 'grades',
						label: <Link to="/grades">Notes</Link>,
						icon: <ScrollText size={16} />,
					},
					{
						key: 'calendar',
						label: <Link to="/calendar">Calendrier</Link>,
						icon: <CalendarDays size={16} />,
					},
				],
			}}
		>
			<Outlet />
		</Main>
	)
}
