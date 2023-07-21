import { FormattedMessage } from 'react-intl';
// export function formatDateToLongDate(date: Date): string {
//   function getMonthName(month: number): string {
//     const monthNames: string[] = [
//       'January',
//       'February',
//       'March',
//       'April',
//       'May',
//       'June',
//       'July',
//       'August',
//       'September',
//       'October',
//       'November',
//       'December',
//     ];
//     return monthNames[month];
//   }

//   function getDayName(day: number): string {
//     const dayNames: string[] = [
//       'Sunday',
//       'Monday',
//       'Tuesday',
//       'Wednesday',
//       'Thursday',
//       'Friday',
//       'Saturday',
//     ];
//     return dayNames[day];
//   }

//   const day: number = date.getDate();
//   const month: number = date.getMonth();
//   const year: number = date.getFullYear();

//   const dayName: string = getDayName(date.getDay());
//   const monthName: string = getMonthName(month);

//   return `${dayName}, ${day} ${monthName} ${year}`;
// }

export function formatDateToLongDate(date: Date, intl: any): string {
  function getMonthName(month: string): string {
    const monthId: { [key: string]: string } = {
      '1': 'date.month.january',
      '2': 'date.month.february',
      '3': 'date.month.march',
      '4': 'date.month.april',
      '5': 'date.month.may',
      '6': 'date.month.june',
      '7': 'date.month.july',
      '8': 'date.month.august',
      '9': 'date.month.september',
      '10': 'date.month.october',
      '11': 'date.month.november',
      '12': 'date.month.december',
    };
    return intl.formatMessage({ id: monthId[month] });
  }

  function getDayName(day: number): string {
    const dayId: { [key: string]: string } = {
      '1': 'date.day.sunday',
      '2': 'date.day.monday',
      '3': 'date.day.tuesday',
      '4': 'date.day.wednesday',
      '5': 'date.day.thursday',
      '6': 'date.day.friday',
      '7': 'date.day.saturday',
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
