import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    BackHandler,
    ScrollView
} from 'react-native'
import React, {
    useEffect,
    useRef,
    useState,
} from 'react'
import { constants, spacing } from 'styles';
import { useIntl } from 'react-intl';
import { useListContext } from 'context/DataProvider';
import { ListType, TaskType } from 'data/types';
import { deadlineNames } from './DeadlineSelector';
import { getFormattedDate } from 'utils/dateFormat';
import { importanceNames } from './ImportanceSelector';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { useAuth } from 'context/AuthContext';
import { useNotification } from 'hooks/useNotification';
import { notificationTimeNames } from './NotificationSelector';

//icons:
import AddTaskIcon from 'assets/button-icons/add-task.svg';
import Selectors from './Selectors';
import FunctionalPanel from './FunctionalPanel';

//components:
import DateTimePickers from './DateTimePickers';
import Button, { buttonTypes } from 'components/button';


type AddTaskFieldProps = {
    currentListId: number;
    color?: string;
}

export default function AddTaskField({ currentListId, color }: AddTaskFieldProps) {
    const navigation = useNavigation();
    const theme = useTheme();
    const intl = useIntl();
    const { user } = useAuth();
    const { listData, addTask } = useListContext();
    const [isInputVisible, setIsInputVisible] = useState(false);
    const lists = listData.filter((item: ListType) => item.isArchived === false);
    const [list, setList] = useState<ListType[]>(lists);
    const [activeList, setActiveList] = useState<ListType>();
    const [isListVisible, setIsListVisible] = useState(false);

    const [isDeadlineVisible, setIsDeadlineVisible] = useState(false);
    const [deadline, setDeadline] = useState<string>("Deadline");
    const [textValue, setTextValue] = useState('');
    const [deadlineDate, setDeadlineDate] = useState<string | null>(null);
    const [showDeadlineDatePicker, setShowDeadlineDatePicker] = useState(false);
    const [showNotificationDatePicker, setShowNotificationDatePicker] = useState(false);

    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [notification, setNotification] = useState<string>("Notification");
    const [notificationDatePickerDate, setNotificationDatePickerDate] = useState<Date>(new Date());
    const [showNotificationTimePicker, setShowNotificationTimePicker] = useState(false);
    const [notificationTime, setNotificationTime] = useState<string | null>(null);
    const [notificationTodayHour, setNotificationTodayHour] = useState<string>('18:00');
    const [notificationTomorrowHour, setNotificationTomorrowHour] = useState<string>('18:00');
    const [datePickerDate, setDatePickerDate] = useState<Date>();
    const [timePickerTime, setTimePickerTime] = useState<Date>();

    const [isImportanceVisible, setIsImportanceVisible] = useState(false);
    const [importance, setImportance] = useState<string>(importanceNames.REMOVE);


    const { displayTriggerNotification } = useNotification();

    const placeholderText = intl.formatMessage({
        id: 'views.authenticated.home.text-input.placeholder',
        defaultMessage: 'Add new task',
    });

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        setActiveList(list.find((item: ListType) => item.IdList === currentListId));
    }, [list]);

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

    const notificationBodyTranslate = intl.formatMessage({
        defaultMessage: "Wake up Samurai, we got a task to complete",
        id: "views.authenticated.home.text-input.notification-body",
    })

    const completeTaskAction = {
        id: 'complete',
        title: 'Completed',
        pressAction: {
            id: 'complete-task',
        },
    };

    const handleCreateNotification = (taskId: number) => {
        if (notificationTime) {
            displayTriggerNotification(
                textValue,
                notificationBodyTranslate,
                new Date(notificationTime).getTime(),
                taskId,
                completeTaskAction
            )
        }
    }
    // TODO: Temporary code
    const handleAddTask = async () => {
        if (textValue.trim() === '') {
            return;
        }
        if (user) {
            const newTask: TaskType = {
                IdTask: -1,
                title: textValue,
                isCompleted: false,
                addedBy: user.ID,
                assignedTo: null,
                deadline: deadlineDate,
                effort: '',
                importance: importance,
                note: '',
                createdAt: new Date().toISOString(),
                notificationTime: notificationTime,
                subtasks: [],
            };

            try {
                const taskId = await addTask(newTask, activeList?.IdList);
                if (taskId) {
                    handleCreateNotification(taskId);
                }
                setDeadline(deadlineNames.REMOVE);
                setDeadlineDate(null);
                setIsDeadlineVisible(false);
                setNotification(notificationTimeNames.REMOVE);
                setNotificationTime(null);
                setIsNotificationVisible(false);
                setImportance(importanceNames.REMOVE);
                setIsImportanceVisible(false);
                setTextValue('');
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };




    useEffect(() => {
        setDeadlineDate(getFormattedDate(deadlineNames.PICK_DATE, datePickerDate) as string);
    }, [datePickerDate]);

    useEffect(() => {
        const updatedLists = listData.filter((item: ListType) => item.isArchived === false);
        setList(updatedLists);
    }, [listData]);

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
                    deadlineDatePickerDate={deadlineDate}
                    timePickerTime={timePickerTime}
                    notificationDatePickerDate={notificationDatePickerDate}
                    showDeadlineDatePicker={showDeadlineDatePicker}
                    showNotificationDatePicker={showNotificationDatePicker}
                    showNotificationTimePicker={showNotificationTimePicker}
                    setShowDeadlineDatePicker={setShowDeadlineDatePicker}
                    setDeadlineDatePickerDate={setDeadlineDate}
                    setDeadline={setDeadline}
                    setShowNotificationTimePicker={setShowNotificationTimePicker}
                    setTimePickerTime={setTimePickerTime}
                    setNotificationTime={setNotificationTime}
                    setNotification={setNotification}
                    setShowNotificationDatePicker={setShowNotificationDatePicker}
                    setNotificationDatePickerDate={setNotificationDatePickerDate}
                />
                <View
                    style={[
                        styles.container,
                        {
                            borderColor: theme.HINT,
                            backgroundColor: theme.BACKGROUND,
                        }]}>

                    <Selectors
                        isListVisible={isListVisible}
                        list={list}
                        setActiveList={setActiveList}
                        setIsListVisible={setIsListVisible}
                        isDeadlineVisible={isDeadlineVisible}
                        deadline={deadline}
                        setDeadline={setDeadline}
                        setIsDeadlineVisible={setIsDeadlineVisible}
                        setDeadlineDate={setDeadlineDate}
                        isNotificationVisible={isNotificationVisible}
                        notification={notification}
                        setNotification={setNotification}
                        setIsNotificationVisible={setIsNotificationVisible}
                        setNotificationTime={setNotificationTime}
                        isImportanceVisible={isImportanceVisible}
                        importance={importance}
                        setImportance={setImportance}
                        setIsImportanceVisible={setIsImportanceVisible}
                        setShowDeadlineDatePicker={setShowDeadlineDatePicker}
                        setShowNotificationDatePicker={setShowNotificationDatePicker}
                        notificationTodayHour={notificationTodayHour}
                        notificationTomorrowHour={notificationTomorrowHour}
                    />

                    <View style={styles.functionPanel}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            keyboardShouldPersistTaps='always'
                        >
                            <FunctionalPanel
                                isListVisible={isListVisible}
                                setIsListVisible={setIsListVisible}
                                isDeadlineVisible={isDeadlineVisible}
                                setIsDeadlineVisible={setIsDeadlineVisible}
                                isNotificationVisible={isNotificationVisible}
                                setIsNotificationVisible={setIsNotificationVisible}
                                isImportanceVisible={isImportanceVisible}
                                setIsImportanceVisible={setIsImportanceVisible}
                                activeList={activeList}
                                deadline={deadline}
                                deadlineDate={deadlineDate}
                                notification={notification}
                                notificationTime={notificationTime}
                                importance={importance}
                            />
                        </ScrollView>
                        <Button
                            type={buttonTypes.BUTTON_TYPES.HIDE_INPUT}
                            onPress={() => setIsInputVisible(false)}
                        />

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
                color={color}
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


    functionPanel: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

