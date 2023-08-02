import { deadlineNames } from 'components/add-task-field/DeadlineSelector';
import { IntlShape } from 'react-intl';

export function getDayName(day: number, intl: IntlShape): string {
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

export function formatDateToLongDate(date: Date, intl: IntlShape): string {
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

  const day: number = date.getDate();
  const month: number = date.getMonth();
  const year: number = date.getFullYear();
  const dayName: string = getDayName(date.getDay(), intl);
  const monthName: string = getMonthName(String(month));

  return `${dayName}, ${day} ${monthName} ${year}`;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function getNextMonday(date: Date): Date {
  const dayOfWeek = date.getDay();
  const diff = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(date);
  nextMonday.setDate(date.getDate() + diff);
  return nextMonday;
}

export function getFormattedDate(
  selectedOption: string,
  deadlineDate?: Date,
): string | null {
  const today = new Date();
  today.setHours(18, 0, 0, 0);
  if (selectedOption === deadlineNames.TODAY) {
    return formatDate(today);
  } else if (selectedOption === deadlineNames.TOMORROW) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return formatDate(tomorrow);
  } else if (selectedOption === deadlineNames.NEXT_WEEK) {
    const nextMonday = getNextMonday(today);
    return formatDate(nextMonday);
  } else if (selectedOption === deadlineNames.PICK_DATE && deadlineDate) {
    const selectedDate = new Date(deadlineDate);
    selectedDate.setHours(18, 0, 0, 0);
    return formatDate(selectedDate);
  } else {
    return null;
  }
}
