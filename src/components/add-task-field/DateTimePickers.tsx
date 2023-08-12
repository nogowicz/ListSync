import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

type DateTimePickersProps = {
    showDeadlineDatePicker: boolean;
    showNotificationDatePicker: boolean;
    showNotificationTimePicker: boolean;
    deadlineDatePickerDate: Date | undefined;
    onChangeDeadlineDate: (event: any, selectedDate?: Date | undefined) => void;
    notificationDatePickerDate: Date | undefined;
    onChangeNotificationDate: (event: any, selectedDate?: Date | undefined) => void;
    timePickerTime: Date | undefined;
    onChangeNotificationTime: (event: any, selectedDate?: Date | undefined) => void;
};

export default function DateTimePickers({
    showDeadlineDatePicker,
    showNotificationDatePicker,
    showNotificationTimePicker,
    deadlineDatePickerDate,
    onChangeDeadlineDate,
    notificationDatePickerDate,
    onChangeNotificationDate,
    timePickerTime,
    onChangeNotificationTime
}: DateTimePickersProps) {
    return (
        <>
            {showDeadlineDatePicker && (
                <DateTimePicker
                    testID='dateTimePicker'
                    value={deadlineDatePickerDate || new Date()}
                    mode={'date'}
                    is24Hour={true}
                    display='default'
                    onChange={onChangeDeadlineDate}
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