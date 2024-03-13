export function formatExcelDate(value: any) {
  const date = new Date(value * 24 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000)
  date.setFullYear(date.getFullYear() - 70)

  return date
}
