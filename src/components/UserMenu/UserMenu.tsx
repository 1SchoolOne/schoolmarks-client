import { Avatar, Dropdown, MenuProps, Space, Typography } from 'antd'
import { ChevronDownIcon, LogOutIcon } from 'lucide-react'
import { useState } from 'react'

import './UserMenu-styles.less'

export function UserMenu() {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const items: MenuProps['items'] = [
		{
			key: 'usermenu-logout',
			icon: <LogOutIcon size={16} />,
			label: 'Déconnexion',
		},
	]

	return (
		<Space direction="horizontal" className={`user-menu${isOpen ? ' user-menu__active' : ''}`}>
			<Avatar>RP</Avatar>
			<Typography.Text strong>Robin PENEA</Typography.Text>
			<Dropdown
				menu={{ items }}
				className="user-menu__dropdown"
				onOpenChange={(open) => {
					setIsOpen(open)
				}}
				trigger={['click']}
			>
				<i className="user-menu__icon">
					<ChevronDownIcon size={16} />
				</i>
			</Dropdown>
		</Space>
	)
}
