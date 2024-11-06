import { Route } from '@types'

import './authenticate-styles.less'

export const authenticateRoute: Route = {
	path: '/authenticate',
	lazy: () => import('./AuthForm'),
}
