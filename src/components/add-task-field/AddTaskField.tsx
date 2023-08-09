import { Keyboard, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider'
import { constants, spacing, typography } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';

import AddTaskIcon from 'assets/button-icons/add-task.svg';
import ListSelection from 'assets/button-icons/list-input-selection.svg';
import CalendarSelection from 'assets/button-icons/calendar-input-selection.svg';
import ImportanceSelection from 'assets/button-icons/importance-input-selection.svg';
import HideArrow from 'assets/button-icons/Back.svg';
import { ScrollView } from 'react-native-gesture-handler';
import { useListContext } from 'context/DataProvider';
import { List, Task } from 'data/types';
import ListSelector from './ListSelector';
import DeadLineSelector, { deadlineNames } from './DeadlineSelector';
import NotificationBell from 'assets/button-icons/notification-bell.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateToShortDate, getFormattedDate, isToday, isTomorrow } from 'utils/dateFormat';
import NotificationSelector, { notificationTimeNames } from './NotificationSelector';
import Button, { buttonTypes } from 'components/button';


type AddTaskFieldProps = {
    currentListId: number;
}

export default function AddTaskField({ currentListId }: AddTaskFieldProps) {
    const theme = useContext(ThemeContext);
    const intl = useIntl();
    const { listData, updateListData } = useListContext();
    const [isInputVisible, setIsInputVisible] = useState(false);
    const lists = listData.filter((item: List) => item.isArchived === false);
    const [list, setList] = useState<List[]>(lists);
    const [activeList, setActiveList] = useState(list.find((item: List) => item.IdList === currentListId));
    const [isListVisible, setIsListVisible] = useState(false);
    const [isDeadlineVisible, setIsDeadlineVisible] = useState(false);
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [deadline, setDeadline] = useState<string>("Deadline");
    const [textValue, setTextValue] = useState('');
    const [deadlineDate, setDeadlineDate] = useState<string | null>(null);
    const [datePickerDate, setDatePickerDate] = useState<Date>();
    const [timePickerTime, setTimePickerTime] = useState<Date>();
    const [notification, setNotification] = useState<string>("Notification");
    const [showDeadlineDatePicker, setShowDeadlineDatePicker] = useState(false);
    const [showNotificationDatePicker, setShowNotificationDatePicker] = useState(false);
    const [deadlineDatePickerDate, setDeadlineDatePickerDate] = useState<Date>();
    const [notificationDatePickerDate, setNotificationDatePickerDate] = useState<Date>();
    const [showNotificationTimePicker, setShowNotificationTimePicker] = useState(false);


    const placeholderText = intl.formatMessage({
        id: 'views.authenticated.home.text-input.placeholder',
        defaultMessage: 'Add new task',
    });

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleAddTask = () => {
        if (textValue.trim() === '') {
            return;
        }

        const newListData = listData.map((list) => {
            if (list.IdList === activeList?.IdList) {
                const newTask: Task = {
                    IdTask: activeList.tasks.length + 10,
                    title: textValue,
                    isCompleted: false,
                    addedBy: 'john',
                    assignedTo: null,
                    deadline: deadlineDate,
                    effort: '',
                    importance: '',
                    note: '',
                    createdAt: new Date().toISOString(),
                    List_idList: activeList?.IdList,
                    subtasks: [],
                };
                return {
                    ...list,
                    tasks: [...list.tasks, newTask],
                };
            } else {
                return list;
            }
        });


        updateListData(() => newListData);


        setTextValue('');
    };



    const onChangeTime = (event: any, selectedDate?: Date | undefined) => {
        if (event.type === 'set') {
            // setShowNotificationTimePicker(Platform.OS === 'ios' ? true : false);
            const currentDate = selectedDate || timePickerTime;
            setTimePickerTime(currentDate);
            setNotification(notificationTimeNames.PICK_DATE);

        } else if (event.type === 'dismissed') {
            setShowNotificationDatePicker(false);
            setShowNotificationTimePicker(false);
        }
    };



    const onChangeDeadlineDate = (event: any, selectedDate?: Date | undefined) => {
        if (event.type === 'set') {
            setShowDeadlineDatePicker(Platform.OS === 'ios' ? true : false);
            const currentDate = selectedDate || deadlineDatePickerDate;
            setDeadlineDatePickerDate(currentDate);
            setDeadline(deadlineNames.PICK_DATE);
        } else if (event.type === 'dismissed') {
            setShowDeadlineDatePicker(false);
        }
    };

    const onChangeNotificationDate = (event: any, selectedDate?: Date | undefined) => {
        if (event.type === 'set') {
            setShowNotificationDatePicker(Platform.OS === 'ios' ? true : false);
            const currentDate = selectedDate || notificationDatePickerDate;
            setNotificationDatePickerDate(currentDate);
            setShowNotificationTimePicker(true);
            // setNotification(notificationTimeNames.PICK_DATE);
        } else if (event.type === 'dismissed') {
            setShowNotificationDatePicker(false);
        }
    };


    const handlePickDate = () => {
        if (isDeadlineVisible) {
            setShowDeadlineDatePicker(true);
            setShowNotificationDatePicker(false);
        } else if (isNotificationVisible) {
            setShowNotificationDatePicker(true);
            // setShowNotificationTimePicker(true);
            setShowDeadlineDatePicker(false);
        }
    };

    const deadlineTranslation: { [key: string]: React.JSX.Element } = {
        'Deadline': (
            <FormattedMessage
                id='views.authenticated.home.text-input.deadline.set'
                defaultMessage={deadline}
            />
        ),
        'Today': (
            <FormattedMessage
                id='views.authenticated.home.text-input.deadline.today'
                defaultMessage={deadline}
            />
        ),
        'Tomorrow': (
            <FormattedMessage
                id='views.authenticated.home.text-input.deadline.tomorrow'
                defaultMessage={deadline}
            />
        ),
        'Next week': (
            <FormattedMessage
                id='views.authenticated.home.text-input.deadline.next-week'
                defaultMessage={deadline}
            />
        ),
        'Pick date': (
            <FormattedMessage
                id='views.authenticated.home.text-input.deadline.pick-date'
                defaultMessage={deadline}
            />
        )
    };

    useEffect(() => {
        setDeadlineDate(getFormattedDate(deadlineNames.PICK_DATE, datePickerDate) as string);
    }, [datePickerDate]);

    if (isInputVisible) {
        return (
            <View>
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
                        onChange={onChangeTime}
                    />}
                <View
                    style={[
                        styles.container,
                        {
                            borderColor: theme.HINT,
                            backgroundColor: theme.BACKGROUND,
                        }]}>

                    {isListVisible &&
                        <ListSelector
                            list={list}
                            setActiveList={setActiveList}
                            setIsListVisible={setIsListVisible}
                        />
                    }

                    {isDeadlineVisible &&
                        <DeadLineSelector
                            setDeadline={setDeadline}
                            deadline={deadline}
                            setIsDeadlineVisible={setIsDeadlineVisible}
                            setDeadlineDate={setDeadlineDate}
                            onPickDatePress={handlePickDate}
                        />
                    }

                    {isNotificationVisible &&
                        <NotificationSelector
                            setNotification={setNotification}
                            notification={notification}
                            setIsNotificationVisible={setIsNotificationVisible}
                            onPickDatePress={handlePickDate}
                        />

                    }
                    <View style={styles.functionPanel}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            keyboardShouldPersistTaps='always'
                        >
                            <View style={styles.upperContainer}>
                                <TouchableOpacity
                                    style={styles.buttons}
                                    onPress={() => {
                                        setIsListVisible(!isListVisible)
                                        setIsDeadlineVisible(false);
                                        setIsNotificationVisible(false);
                                    }}
                                >
                                    <ListSelection
                                        stroke={activeList?.IdList === 1 ? theme.HINT : theme.PRIMARY}
                                        strokeWidth={constants.STROKE_WIDTH.ICON}
                                    />
                                    <Text style={{
                                        color: activeList?.IdList === 1 ? theme.HINT : theme.PRIMARY,
                                    }}>
                                        {activeList?.listName === 'All' ?
                                            <FormattedMessage
                                                id='views.authenticated.home.text-input.list-name.all'
                                                defaultMessage={'All'}
                                            /> :
                                            activeList?.listName
                                        }
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.buttons}
                                    onPress={() => {
                                        setIsDeadlineVisible(!isDeadlineVisible)
                                        setIsListVisible(false);
                                        setIsNotificationVisible(false);
                                    }}
                                >
                                    <CalendarSelection
                                        fill={deadline === deadlineNames.REMOVE ? theme.HINT : theme.PRIMARY}
                                    />
                                    <Text
                                        style={{
                                            color: deadline === deadlineNames.REMOVE ? theme.HINT : theme.PRIMARY,
                                        }}
                                    >
                                        {deadline !== deadlineNames.NEXT_WEEK && deadline !== deadlineNames.PICK_DATE ? (
                                            deadline === deadlineNames.TODAY ? deadlineNames.TODAY : deadline === deadlineNames.TOMORROW ? deadlineNames.TOMORROW : deadlineTranslation[deadline]
                                        ) : (
                                            isToday(new Date(deadlineDate as string)) ? deadlineNames.TODAY : isTomorrow(new Date(deadlineDate as string)) ? deadlineNames.TOMORROW : formatDateToShortDate(new Date(deadlineDate as string), intl)
                                        )}
                                    </Text>

                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.buttons}
                                    onPress={() => {
                                        setIsNotificationVisible(!isNotificationVisible)
                                        setIsListVisible(false);
                                        setIsDeadlineVisible(false);
                                    }}
                                >
                                    <NotificationBell
                                        stroke={theme.HINT}
                                        strokeWidth={constants.STROKE_WIDTH.ICON}
                                    />
                                    <Text style={{ color: theme.HINT }}>
                                        <FormattedMessage
                                            id='views.authenticated.home.text-input.notification'
                                            defaultMessage={'Notification'}
                                        />
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttons}>
                                    <ImportanceSelection
                                        stroke={theme.HINT}
                                        strokeWidth={constants.STROKE_WIDTH.ICON}
                                    />
                                    <Text style={{ color: theme.HINT }}>
                                        <FormattedMessage
                                            id='views.authenticated.home.text-input.importance'
                                            defaultMessage={'Importance'}
                                        />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        <TouchableOpacity
                            activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                            style={styles.hideArrow}
                            onPress={() => {
                                setIsInputVisible(false);
                            }}
                        >
                            <HideArrow
                                fill={theme.HINT}
                                strokeWidth={constants.STROKE_WIDTH.ICON}
                                width={15}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomContainer}>
                        <TextInput
                            ref={inputRef}
                            autoFocus={true}
                            placeholder={placeholderText}
                            placeholderTextColor={theme.HINT}
                            style={[styles.textInput, { color: theme.TEXT, }]}
                            value={textValue}
                            onChangeText={(text) => setTextValue(text)}
                        />
                        <TouchableOpacity
                            activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                            style={{
                                padding: spacing.SCALE_8,
                            }}
                            onPress={handleAddTask}
                        >
                            <AddTaskIcon />
                        </TouchableOpacity>
                    </View>
                </View>

            </View >
        );
    } else {
        return (
            <Button
                type={buttonTypes.BUTTON_TYPES.FAB}
                onPress={() => setIsInputVisible(true)}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        marginBottom: spacing.SCALE_20,
        paddingHorizontal: spacing.SCALE_20,
        paddingVertical: spacing.SCALE_8,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    textInput: {
        maxWidth: '90%',
    },
    upperContainer: {
        flexDirection: 'row',
        gap: spacing.SCALE_20,
        alignItems: 'center',
        marginBottom: spacing.SCALE_8,
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.SCALE_8,
    },
    hideArrow: {
        transform: [{ rotate: '-90deg' }],
        paddingHorizontal: spacing.SCALE_12,
        paddingVertical: spacing.SCALE_8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.SCALE_6,
        marginRight: -spacing.SCALE_12,
    },
    functionPanel: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
})