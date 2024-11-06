import { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom'

export type Route = IndexRoute | NonIndexRoute

interface IndexRoute extends Omit<IndexRouteObject, 'handle'> {
	handle?: Handle
}

interface NonIndexRoute extends Omit<NonIndexRouteObject, 'handle'> {
	handle?: Handle
}

export interface Handle {
	crumb?: Crumb
}

export interface Crumb {
	label: string
	path: string
}
