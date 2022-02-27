export const parseStringToDate = (dateStr) => {
	const day = +dateStr.slice(0, 2) + 1
	const month = +dateStr.slice(3, 5) - 1
	const year = +dateStr.slice(6, 10)
	return new Date(year, month, day)
}
