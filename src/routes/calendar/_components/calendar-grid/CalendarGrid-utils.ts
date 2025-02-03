export function getCurrentTimePosition(startHour: number, endHour: number): number {
	const now = new Date()
	const currentHour = now.getHours()
	const currentMinutes = now.getMinutes()

	if (currentHour < startHour || currentHour >= endHour) return -1

	const totalMinutes = (endHour - startHour) * 60
	const elapsedMinutes = (currentHour - startHour) * 60 + currentMinutes

	return (elapsedMinutes / totalMinutes) * 100
}
