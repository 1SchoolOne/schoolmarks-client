import { MainLayout as Main, PropsWithChildren, useTheme } from '@1schoolone/ui'
import { Flex, Segmented } from 'antd'
import { CalendarDays, Clock, MoonStarIcon, ScrollText, SunIcon } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import { Link, UserMenu } from '@components'

import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs'

import './MainLayout-styles.less'

export function MainLayout({ children }: PropsWithChildren) {
	const location = useLocation()
	const { toggleTheme, theme } = useTheme()

	return (
		<Main
			header={
				<Flex justify="space-between" align="center">
					<Breadcrumbs />
					<Segmented
						value={theme}
						onChange={toggleTheme}
						options={[
							{ icon: <SunIcon size={16} />, value: 'light' },
							{ icon: <MoonStarIcon size={16} />, value: 'dark' },
						]}
					/>
					<UserMenu />
				</Flex>
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
