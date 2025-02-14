export function getCurrentTimePosition(
	startHour: number,
	endHour: number,
	hourHeight: number,
): number {
	const now = new Date()
	const currentHour = now.getHours()
	const currentMinutes = now.getMinutes()

	if (currentHour < startHour || currentHour >= endHour) return -1

	// Convertit l'écart de temps en minutes entre l'heure actuelle et le début de la journée
	const elapsedMinutes = (currentHour - startHour) * 60 + currentMinutes

	const pixelPerMinute = hourHeight / 60
	const positionPixels = elapsedMinutes * pixelPerMinute

	return positionPixels
}
