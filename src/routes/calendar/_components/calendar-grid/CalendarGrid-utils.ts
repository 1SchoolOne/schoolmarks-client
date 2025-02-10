export function getCurrentTimePosition(startHour: number, endHour: number): number {
	const now = new Date()
	const currentHour = now.getHours()
	const currentMinutes = now.getMinutes()

	if (currentHour < startHour || currentHour >= endHour) return -1

	const elapsedMinutes = (currentHour - startHour) * 60 + currentMinutes

	const pixelPerMinute = 53 / 60
	const positionPixels = elapsedMinutes * pixelPerMinute

	return positionPixels
}
