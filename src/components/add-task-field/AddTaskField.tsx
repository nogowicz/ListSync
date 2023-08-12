import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, BackHandler, } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider'
import { constants, spacing } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';

import AddTaskIcon from 'assets/button-icons/add-task.svg';



import HideArrow from 'assets/button-icons/Back.svg';
import { ScrollView } from 'react-native-gesture-handler';
import { useListContext } from 'context/DataProvider';
import { List, Task } from 'data/types';
import ListSelector from './ListSelector';
import DeadLineSelector, { deadlineNames } from './DeadlineSelector';

import { formatDateToShortDateWithTime, getFormattedDate } from 'utils/dateFormat';
import NotificationSelector, { notificationTimeNames } from './NotificationSelector';
import Button, { buttonTypes } from 'components/button';
import ImportanceSelector, { importanceNames } from './ImportanceSelector';
import { useNavigation } from '@react-navigation/native';
import DateTimePickers from './DateTimePickers';
import FunctionPanelButtons, { FUNCTIONAL_BUTTONS_NAMES } from './FunctionPanelButtons';


type AddTaskFieldProps = {
    currentListId: number;
}

export default function AddTaskField({ currentListId }: AddTaskFieldProps) {
    const navigation = useNavigation();
    const theme = useContext(ThemeContext);
    const intl = useIntl();
    const { listData, updateListData } = useListContext();
    const [isInputVisible, setIsInputVisible] = useState(false);
    const lists = listData.filter((item: List) => item.isArchived === false);
    const [list, setList] = useState<List[]>(lists);
    const [activeList, setActiveList] = useState(list.find((item: List) => item.IdList === currentListId));
    const [isListVisible, setIsListVisible] = useState(false);

    const [isDeadlineVisible, setIsDeadlineVisible] = useState(false);
    const [deadline, setDeadline] = useState<string>("Deadline");
    const [textValue, setTextValue] = useState('');
    const [deadlineDate, setDeadlineDate] = useState<string | null>(null);
    const [showDeadlineDatePicker, setShowDeadlineDatePicker] = useState(false);
    const [showNotificationDatePicker, setShowNotificationDatePicker] = useState(false);
    const [deadlineDatePickerDate, setDeadlineDatePickerDate] = useState<Date>();

    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [notification, setNotification] = useState<string>("Notification");
    const [notificationDatePickerDate, setNotificationDatePickerDate] = useState<Date>(new Date());
    const [showNotificationTimePicker, setShowNotificationTimePicker] = useState(false);
    const [notificationTime, setNotificationTime] = useState<Date>();
    const [notificationTodayHour, setNotificationTodayHour] = useState<string>('18:00');
    const [notificationTomorrowHour, setNotificationTomorrowHour] = useState<string>('18:00');
    const [datePickerDate, setDatePickerDate] = useState<Date>();
    const [timePickerTime, setTimePickerTime] = useState<Date>();

    const [isImportanceVisible, setIsImportanceVisible] = useState(false);
    const [importance, setImportance] = useState<string>(importanceNames.REMOVE);


    const placeholderText = intl.formatMessage({
        id: 'views.authenticated.home.text-input.placeholder',
        defaultMessage: 'Add new task',
    });

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        inputRef.current?.focus();

        const now = new Date();
        if (now.getHours() > 17 || (now.getHours() === 17 && now.getMinutes() > 50)) {
            setNotificationTodayHour('22:00');
        } else if (now.getHours() > 21 || (now.getHours() === 21 && now.getMinutes() > 50)) {
            setNotificationTodayHour('23:30');
        } else {
            setNotificationTodayHour('18:00');
        }

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
                    importance: importance,
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

            console.log(combinedDate.toISOString())
            setNotificationTime(combinedDate);
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


    const handlePickDate = () => {
        if (isDeadlineVisible) {
            setShowDeadlineDatePicker(true);
            setShowNotificationDatePicker(false);
        } else if (isNotificationVisible) {
            setShowNotificationDatePicker(true);
            setShowDeadlineDatePicker(false);
        }
    };





    useEffect(() => {
        setDeadlineDate(getFormattedDate(deadlineNames.PICK_DATE, datePickerDate) as string);
    }, [datePickerDate]);


    BackHandler.addEventListener('hardwareBackPress', () => {
        if (isInputVisible) {
            setIsInputVisible(false);
            return true;
        } else {
            if (navigation.canGoBack()) {
                navigation.goBack();
                return true;
            }
            BackHandler.exitApp();
        }
    });

    if (isInputVisible) {
        return (
            <View>
                <DateTimePickers
                    deadlineDatePickerDate={deadlineDatePickerDate}
                    timePickerTime={timePickerTime}
                    notificationDatePickerDate={notificationDatePickerDate}
                    showDeadlineDatePicker={showDeadlineDatePicker}
                    showNotificationDatePicker={showNotificationDatePicker}
                    showNotificationTimePicker={showNotificationTimePicker}
                    onChangeDeadlineDate={onChangeDeadlineDate}
                    onChangeNotificationDate={onChangeNotificationDate}
                    onChangeNotificationTime={onChangeNotificationTime}
                />
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
                            setNotificationTime={setNotificationTime}
                            onPickDatePress={handlePickDate}
                            notificationTodayHour={notificationTodayHour}
                            notificationTomorrowHour={notificationTomorrowHour}
                        />
                    }

                    {isImportanceVisible &&
                        <ImportanceSelector
                            importance={importance}
                            setImportance={setImportance}
                            setIsImportanceVisible={setIsImportanceVisible}
                        />
                    }
                    <View style={styles.functionPanel}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            keyboardShouldPersistTaps='always'
                        >
                            <View style={styles.upperContainer}>
                                <FunctionPanelButtons
                                    isListVisible={isListVisible}
                                    setIsListVisible={setIsListVisible}
                                    setIsDeadlineVisible={setIsDeadlineVisible}
                                    setIsNotificationVisible={setIsNotificationVisible}
                                    setIsImportanceVisible={setIsImportanceVisible}
                                    type={FUNCTIONAL_BUTTONS_NAMES.LIST}
                                    activeList={activeList}
                                />

                                <FunctionPanelButtons
                                    isDeadlineVisible={isDeadlineVisible}
                                    setIsListVisible={setIsListVisible}
                                    setIsDeadlineVisible={setIsDeadlineVisible}
                                    setIsNotificationVisible={setIsNotificationVisible}
                                    setIsImportanceVisible={setIsImportanceVisible}
                                    type={FUNCTIONAL_BUTTONS_NAMES.DEADLINE}
                                    deadline={deadline}
                                    deadlineDate={deadlineDate}
                                />


                                <FunctionPanelButtons
                                    isNotificationVisible={isNotificationVisible}
                                    setIsListVisible={setIsListVisible}
                                    setIsDeadlineVisible={setIsDeadlineVisible}
                                    setIsNotificationVisible={setIsNotificationVisible}
                                    setIsImportanceVisible={setIsImportanceVisible}
                                    type={FUNCTIONAL_BUTTONS_NAMES.NOTIFICATION}
                                    notification={notification}
                                    notificationTime={notificationTime}
                                />

                                <FunctionPanelButtons
                                    isImportanceVisible={isImportanceVisible}
                                    setIsListVisible={setIsListVisible}
                                    setIsDeadlineVisible={setIsDeadlineVisible}
                                    setIsNotificationVisible={setIsNotificationVisible}
                                    setIsImportanceVisible={setIsImportanceVisible}
                                    type={FUNCTIONAL_BUTTONS_NAMES.IMPORTANCE}
                                    importance={importance}
                                />

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