import React, { Dispatch, SetStateAction, } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import { deadlineNames } from './DeadlineSelector';
import { notificationTimeNames } from './NotificationSelector';

type DateTimePickersProps = {
    showDeadlineDatePicker: boolean;
    showNotificationDatePicker: boolean;
    showNotificationTimePicker: boolean;
    deadlineDatePickerDate: string | null;
    notificationDatePickerDate: Date;
    timePickerTime: Date | undefined;
    setShowDeadlineDatePicker: Dispatch<SetStateAction<boolean>>;
    setDeadlineDatePickerDate: Dispatch<SetStateAction<string | null>>;
    setDeadline: Dispatch<SetStateAction<string>>;
    setShowNotificationTimePicker: Dispatch<SetStateAction<boolean>>;
    setTimePickerTime: Dispatch<SetStateAction<Date | undefined>>;
    setNotificationTime: Dispatch<SetStateAction<string | null>>;
    setNotification: Dispatch<SetStateAction<string>>;
    setShowNotificationDatePicker: Dispatch<SetStateAction<boolean>>;
    setNotificationDatePickerDate: Dispatch<SetStateAction<Date>>;
};

export default function DateTimePickers({
    showDeadlineDatePicker,
    showNotificationDatePicker,
    showNotificationTimePicker,
    deadlineDatePickerDate,
    notificationDatePickerDate,
    timePickerTime,
    setShowDeadlineDatePicker,
    setDeadlineDatePickerDate,
    setDeadline,
    setShowNotificationTimePicker,
    setTimePickerTime,
    setNotificationTime,
    setNotification,
    setShowNotificationDatePicker,
    setNotificationDatePickerDate,
}: DateTimePickersProps) {

    const onChangeDeadlineDate = (event: any, selectedDate?: Date | undefined) => {
        if (event.type === 'set') {
            setShowDeadlineDatePicker(Platform.OS === 'ios' ? true : false);
            const currentDate = selectedDate || deadlineDatePickerDate;
            const currentDateAsString = currentDate?.toString();
            setDeadlineDatePickerDate(currentDateAsString ?? null);
            setDeadline(deadlineNames.PICK_DATE);
        } else if (event.type === 'dismissed') {
            setShowDeadlineDatePicker(false);
        }
    };

    const onChangeNotificationTime = (event: any, selectedDate?: Date | undefined) => {
        if (event.type === 'set') {
            setShowNotificationTimePicker(Platform.OS === 'ios' ? true : false);
            const currentDate = selectedDate ?? timePickerTime ?? new Date();

            setTimePickerTime(currentDate);

            const combinedDate = new Date(
                notificationDatePickerDate.getFullYear(),
                notificationDatePickerDate.getMonth(),
                notificationDatePickerDate.getDate(),
                currentDate.getHours(),
                currentDate.getMinutes()
            );

            setNotificationTime(combinedDate.toISOString());
            setNotification(notificationTimeNames.PICK_DATE);
        } else if (event.type === 'dismissed') {
            setShowNotificationDatePicker(false);
            setShowNotificationTimePicker(false);
        }
    };

    const onChangeNotificationDate = (event: any, selectedDate?: Date | undefined) => {
        if (event.type === 'set') {
            setShowNotificationDatePicker(Platform.OS === 'ios' ? true : false);
            const currentDate = selectedDate || notificationDatePickerDate;
            setNotificationDatePickerDate(currentDate);
            setShowNotificationTimePicker(true);
        } else if (event.type === 'dismissed') {
            setShowNotificationDatePicker(false);
        }
    };



    return (
        <>
            {showDeadlineDatePicker && (
                <DateTimePicker
                    testID='dateTimePicker'
                    value={new Date(deadlineDatePickerDate as string) || new Date()}
                    mode={'date'}
                    is24Hour={true}
                    display='default'
                    onChange={onChangeDeadlineDate}
                    minimumDate={new Date()}
                />
            )}
            {showNotificationDatePicker && (
                <DateTimePicker
                    testID='dateTimePicker'
                    value={notificationDatePickerDate || new Date()}
                    mode={'date'}
                    is24Hour={true}
                    display='default'
                    onChange={onChangeNotificationDate}
                    minimumDate={new Date()}
                />
            )}
            {showNotificationTimePicker &&
                <DateTimePicker
                    testID='dateTimePicker'
                    value={timePickerTime || new Date()}
                    mode={'time'}
                    is24Hour={true}
                    display='default'
                    onChange={onChangeNotificationTime}
                />}
        </>
    )
}