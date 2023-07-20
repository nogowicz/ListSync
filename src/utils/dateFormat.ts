export function formatDateToLongDate(date: Date): string {
  function getMonthName(month: number): string {
    const monthNames: string[] = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[month];
  }

  function getDayName(day: number): string {
    const dayNames: string[] = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return dayNames[day];
  }

  const day: number = date.getDate();
  const month: number = date.getMonth();
  const year: number = date.getFullYear();

  const dayName: string = getDayName(date.getDay());
  const monthName: string = getMonthName(month);

  return `${dayName}, ${day} ${monthName} ${year}`;
}
