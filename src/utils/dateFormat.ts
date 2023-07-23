export function formatDateToLongDate(date: Date, intl: any): string {
  function getMonthName(month: string): string {
    const monthId: { [key: string]: string } = {
      '0': 'date.month.january',
      '1': 'date.month.february',
      '2': 'date.month.march',
      '3': 'date.month.april',
      '4': 'date.month.may',
      '5': 'date.month.june',
      '6': 'date.month.july',
      '7': 'date.month.august',
      '8': 'date.month.september',
      '9': 'date.month.october',
      '10': 'date.month.november',
      '11': 'date.month.december',
    };
    return intl.formatMessage({ id: monthId[month] });
  }

  function getDayName(day: number): string {
    const dayId: { [key: string]: string } = {
      '0': 'date.day.sunday',
      '1': 'date.day.monday',
      '2': 'date.day.tuesday',
      '3': 'date.day.wednesday',
      '4': 'date.day.thursday',
      '5': 'date.day.friday',
      '6': 'date.day.saturday',
    };
    return intl.formatMessage({ id: dayId[day] });
  }

  const day: number = date.getDate();
  const month: number = date.getMonth();
  const year: number = date.getFullYear();
  const dayName: string = getDayName(date.getDay());
  const monthName: string = getMonthName(String(month));

  return `${dayName}, ${day} ${monthName} ${year}`;
}
