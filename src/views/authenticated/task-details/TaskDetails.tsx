import { StyleSheet, TextInput, View, Text, TouchableOpacity, Keyboard, NativeSyntheticEvent, TextInputKeyPressEventData, Animated, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { constants, spacing, typography } from 'styles'
import { useTheme } from 'navigation/utils/ThemeProvider'
import NavigationTopBar, { navigationTypes } from 'components/navigation-top-bar';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'navigation/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormattedMessage, useIntl } from 'react-intl';
import Button, { buttonTypes } from 'components/button';
import { useListContext } from 'context/DataProvider';
import { ListType, SubtaskType, TaskType } from 'data/types';
import { useAuth } from 'context/AuthContext';
import SubTask from 'components/sub-task';
import DateTimePickers from 'components/add-task-field/DateTimePickers';
import { formatDateToShortDateWithTime } from 'utils/dateFormat';
import { useNotification } from 'hooks/useNotification';

//icons:
import AddIcon from 'assets/button-icons/plus.svg';
import NotificationIcon from 'assets/button-icons/notification-bell.svg';
import DeadlineIcon from 'assets/button-icons/calendar-pick-date.svg';
import ImportanceIcon from 'assets/button-icons/importance-input-selection.svg';
import CloseIcon from 'assets/button-icons/close.svg';



type TaskDetailsScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'TASK_DETAILS'>;
type TaskDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TASK_DETAILS'>;

type TaskDetailsProps = {
    navigation: TaskDetailsScreenNavigationProp['navigation'];
    route: TaskDetailsScreenRouteProp;
};



export default function TaskDetails({ navigation, route }: TaskDetailsProps) {
    const theme = useTheme();
    const intl = useIntl();
    const { task, color, currentListId }: any = route.params;
    const [taskTitle, setTaskTitle] = useState<string>(task.title);
    const { listData, completeTask, addSubtask, completeSubtask, updateTask } = useListContext();
    const { displayTriggerNotification, cancelNotification } = useNotification();
    const { user } = useAuth();
    const [currentTask, setCurrentTask] = useState<TaskType | undefined>(task);
    const [isSubtaskInputVisible, setIsSubtaskInputVisible] = useState<boolean>(false);
    const [subtaskTitle, setSubtaskTitle] = useState<string>("");

    const [deadline, setDeadline] = useState<string>("Deadline");
    const [showDeadlineDatePicker, setShowDeadlineDatePicker] = useState(false);
    const [showNotificationDatePicker, setShowNotificationDatePicker] = useState(false);
    const [deadlineDatePickerDate, setDeadlineDatePickerDate] = useState<Date>();

    const [notification, setNotification] = useState<string>("Notification");
    const [notificationDatePickerDate, setNotificationDatePickerDate] = useState<Date>(new Date());
    const [showNotificationTimePicker, setShowNotificationTimePicker] = useState(false);
    const [notificationTime, setNotificationTime] = useState<string | null>(currentTask ? currentTask.notificationTime : null);
    const [timePickerTime, setTimePickerTime] = useState<Date>();

    //translations:
    const editTaskTranslation = intl.formatMessage({
        defaultMessage: "Edit task",
        id: "views.authenticated.task.details.edit-task"
    });
    const taskTitlePlaceholderTranslation = intl.formatMessage({
        id: "views.authenticated.task.details.task-title-placeholder",
        defaultMessage: "Task name"
    });
    const subtaskTitlePlaceholderTranslation = intl.formatMessage({
        id: 'views.authenticated.task.details.add-subtask',
        defaultMessage: 'Add subtask'
    });
    const notificationBodyTranslate = intl.formatMessage({
        defaultMessage: "Wake up Samurai, we got a task to complete",
        id: "views.authenticated.home.text-input.notification-body",
    })

    useEffect(() => {
        setCurrentTask(listData.find((list: ListType) => list.IdList === currentListId)?.tasks.find((taskItem: TaskType) => taskItem.IdTask === currentTask?.IdTask));
    }, [listData]);

    useEffect(() => {
        if (notificationTime && currentTask) {
            displayTriggerNotification(
                taskTitle,
                notificationBodyTranslate,
                new Date(notificationTime).getTime(),
                currentTask.IdTask,
                completeTaskAction
            )
        }
    }, [notificationTime]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {

        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setIsSubtaskInputVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    function onSubmitPressed() {
        if (user && currentTask) {
            const newSubtask: SubtaskType = {
                idSubtask: -1,
                title: subtaskTitle,
                isCompleted: false,
                Task_idTask: currentTask.IdTask,
                addedBy: user.ID,
                createdAt: new Date().toISOString(),
            }
            addSubtask(newSubtask, currentTask.IdTask, currentListId);
            setSubtaskTitle("");
        }

    }
    const completeTaskAction = {
        id: 'complete',
        title: 'Completed',
        pressAction: {
            id: 'complete-task',
        },
    };

    const handleCompleteSubtask = (updatedSubtask: SubtaskType) => {
        completeSubtask(updatedSubtask);
    };

    const extraActionWhenGoBackPressed = () => {
        if (currentTask) {
            const updatedTask: TaskType = {
                IdTask: currentTask.IdTask,
                title: taskTitle,
                isCompleted: currentTask.isCompleted,
                deadline: currentTask.deadline,
                importance: currentTask.importance,
                effort: currentTask.effort,
                note: currentTask.note,
                addedBy: currentTask.addedBy,
                assignedTo: currentTask.assignedTo,
                createdAt: currentTask.createdAt,
                notificationTime: notificationTime,
                subtasks: currentTask.subtasks,
            }
            console.log("Updated task", updatedTask)
            updateTask(updatedTask);
        }

    }

    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <NavigationTopBar
                    name={editTaskTranslation}
                    type={navigationTypes.NAVIGATION_TOP_BAR_TYPES.BASIC}
                    extraActionWhenGoBackPressed={extraActionWhenGoBackPressed}
                />
                <View style={styles.editTaskContainer}>
                    <View style={styles.taskTitleContainer}>
                        <Button
                            type={buttonTypes.BUTTON_TYPES.CHECK}
                            onPress={() => completeTask(currentTask ? currentTask : task)}
                            isChecked={currentTask?.isCompleted}
                            color={color}
                        />
                        <TextInput
                            defaultValue={currentTask?.title}
                            value={taskTitle}
                            onChangeText={(text: string) => setTaskTitle(text)}
                            style={[styles.textInputStyle, { color: theme.TEXT }]}
                            placeholder={taskTitlePlaceholderTranslation}
                            placeholderTextColor={theme.HINT}

                        />
                    </View>
                    <View
                        style={[styles.subtasks]}
                    >
                        {currentTask?.subtasks.map((subtask: SubtaskType) => (
                            <SubTask
                                key={subtask.idSubtask}
                                handleCompleteSubtask={() => handleCompleteSubtask(subtask)}
                                item={subtask}
                                color={color}
                                deleteButton={true}
                                listId={currentListId}
                            />
                        ))}
                    </View>
                    {isSubtaskInputVisible ?
                        <View style={styles.subtaskTitleContainer}>
                            <Button
                                type={buttonTypes.BUTTON_TYPES.CHECK}
                                onPress={() => { }}
                                color={color}

                            />
                            <TextInput
                                defaultValue={""}
                                value={subtaskTitle}
                                onChangeText={(text: string) => setSubtaskTitle(text)}
                                style={[styles.textInputStyle, { color: theme.TEXT }]}
                                placeholder={subtaskTitlePlaceholderTranslation}
                                placeholderTextColor={theme.HINT}
                                autoFocus={true}
                                onSubmitEditing={onSubmitPressed}
                            />
                        </View>
                        :
                        <TouchableOpacity
                            style={styles.addSubtaskContainer}
                            activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                            onPress={() => setIsSubtaskInputVisible(!isSubtaskInputVisible)}
                        >
                            <AddIcon
                                stroke={color}
                                strokeWidth={1.5}
                                width={constants.ICON_SIZE.COLOR}
                                height={constants.ICON_SIZE.COLOR}
                            />
                            <Text style={[{ color: theme.TEXT }, styles.addSubtaskText]}>
                                {subtaskTitlePlaceholderTranslation}
                            </Text>
                        </TouchableOpacity>}
                </View>
                <View style={styles.detailsButtons}>
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        onPress={() => {
                            setShowNotificationDatePicker(true)
                        }}
                        style={[styles.notificationButton, { borderBottomColor: theme.HINT }]}
                    >
                        <View style={styles.buttonLeftContainer}>
                            <NotificationIcon
                                stroke={notificationTime ? color : theme.TEXT}
                                strokeWidth={notificationTime ? constants.STROKE_WIDTH.ICON_BOLD : constants.STROKE_WIDTH.ICON}
                            />
                            <Text style={[{
                                color: notificationTime ? color : theme.TEXT,
                                fontWeight: notificationTime ? typography.FONT_WEIGHT_BOLD : typography.FONT_WEIGHT_REGULAR,
                            },
                            styles.notificationButtonText]}>

                                {notificationTime ?
                                    formatDateToShortDateWithTime(new Date(notificationTime), intl)
                                    :
                                    <FormattedMessage
                                        id='views.authenticated.task.details.set-notification'
                                        defaultMessage='Set notification'
                                    />}
                            </Text>
                        </View>
                        {notificationTime &&
                            <Button
                                icon={<CloseIcon />}
                                onPress={() => {
                                    setNotificationTime(null);
                                    cancelNotification(String(currentTask?.IdTask));
                                }}
                                type={buttonTypes.BUTTON_TYPES.WITH_ICON}
                                color={color}
                            />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        onPress={() => { }}
                        style={[styles.notificationButton, { borderBottomColor: theme.HINT }]}
                    >
                        <View style={styles.buttonLeftContainer}>
                            <DeadlineIcon
                                stroke={theme.TEXT}
                                strokeWidth={constants.STROKE_WIDTH.ICON}
                            />
                            <Text style={[{ color: theme.TEXT }, styles.notificationButtonText]}>
                                <FormattedMessage
                                    id='views.authenticated.task.details.set-deadline'
                                    defaultMessage='Set deadline'
                                />
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        onPress={() => { }}
                        style={[styles.notificationButton, { borderBottomColor: theme.HINT }]}
                    >
                        <View style={styles.buttonLeftContainer}>
                            <ImportanceIcon
                                stroke={theme.TEXT}
                                strokeWidth={constants.STROKE_WIDTH.ICON}
                            />
                            <Text style={[{ color: theme.TEXT }, styles.notificationButtonText]}>
                                <FormattedMessage
                                    id='views.authenticated.task.details.set-importance'
                                    defaultMessage='Set importance'
                                />
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <DateTimePickers
                deadlineDatePickerDate={deadlineDatePickerDate}
                timePickerTime={timePickerTime}
                notificationDatePickerDate={notificationDatePickerDate}
                showDeadlineDatePicker={showDeadlineDatePicker}
                showNotificationDatePicker={showNotificationDatePicker}
                showNotificationTimePicker={showNotificationTimePicker}
                setShowDeadlineDatePicker={setShowDeadlineDatePicker}
                setDeadlineDatePickerDate={setDeadlineDatePickerDate}
                setDeadline={setDeadline}
                setShowNotificationTimePicker={setShowNotificationTimePicker}
                setTimePickerTime={setTimePickerTime}
                setNotificationTime={setNotificationTime}
                setNotification={setNotification}
                setShowNotificationDatePicker={setShowNotificationDatePicker}
                setNotificationDatePickerDate={setNotificationDatePickerDate}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        marginHorizontal: spacing.SCALE_20,
        marginTop: spacing.SCALE_20,
        flex: 1,
    },
    editTaskContainer: {
        paddingHorizontal: spacing.SCALE_10,
    },
    taskTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInputStyle: {
        fontSize: typography.FONT_SIZE_18,
        flex: 1,
    },
    addSubtaskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.SCALE_4,
        paddingHorizontal: spacing.SCALE_8
    },
    addSubtaskText: {
        fontSize: typography.FONT_SIZE_18,
        marginLeft: spacing.SCALE_8,
    },
    subtaskTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: spacing.SCALE_16
    },
    subtasks: {
        marginTop: spacing.SCALE_4,
        marginHorizontal: spacing.SCALE_16,
        overflow: 'hidden',
    },
    detailsButtons: {
        marginTop: spacing.SCALE_20,
        marginHorizontal: spacing.SCALE_22,
    },
    notificationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingVertical: spacing.SCALE_16,
        justifyContent: 'space-between'
    },
    buttonLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.SCALE_10,
    },
    notificationButtonText: {
        fontSize: typography.FONT_SIZE_16,
    },
});