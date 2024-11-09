import { Breadcrumb, Typography } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { BreadcrumbItemType, BreadcrumbSeparatorType } from 'antd/es/breadcrumb/Breadcrumb'
import { Link, UIMatch, useMatches } from 'react-router-dom'

import { Crumb } from '@types'

import './Breadcrumbs-styles.less'

export type MatchWithCrumb = UIMatch<
	unknown,
	{
		crumb: Crumb
	}
>

export type Match = UIMatch<
	unknown,
	{
		crumb?: Crumb
	}
>

function isMatchWithCrumb(match: Match): match is MatchWithCrumb {
	return match.handle?.crumb !== undefined
}

export function getCrumbsFromMatches(matches: Match[]): Crumb[] {
	return matches.filter(isMatchWithCrumb).map((match) => match.handle.crumb)
}

function itemRender(
	currentRoute: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>,
	_params: AnyObject,
	items: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[],
	paths: string[],
) {
	const isLast = currentRoute?.path === items[items.length - 1]?.path

	return isLast ? (
		<span>{currentRoute.title}</span>
	) : (
		<Link to={`/${paths.join('/')}`}>{currentRoute.title}</Link>
	)
}

export function Breadcrumbs() {
	const matches = useMatches() as Match[]
	const crumbs: Crumb[] = getCrumbsFromMatches(matches)

	return (
		<Breadcrumb
			className="path-breadcrumb"
			itemRender={itemRender}
			items={crumbs.map((crumb, index) => ({
				title:
					index === 0 ? <Typography.Title level={3}>{crumb.label}</Typography.Title> : crumb.label,
				path: crumb.path,
			}))}
		/>
	)
}
