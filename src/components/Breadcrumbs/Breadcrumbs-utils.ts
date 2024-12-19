import { Crumb } from '@types'

import { Match, MatchWithCrumb } from './Breadcrumbs'

function isMatchWithCrumb(match: Match): match is MatchWithCrumb {
	return match.handle?.crumb !== undefined
}

export function getCrumbsFromMatches(matches: Match[]): Crumb[] {
	return matches.filter(isMatchWithCrumb).map((match) => match.handle.crumb)
}
