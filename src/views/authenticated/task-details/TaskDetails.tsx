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

//icons:
import AddIcon from 'assets/button-icons/plus.svg';
import NotificationIcon from 'assets/button-icons/notification-bell.svg';
import DeadlineIcon from 'assets/button-icons/calendar-pick-date.svg';
import ImportanceIcon from 'assets/button-icons/importance-input-selection.svg';


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
    const { listData, completeTask, addSubtask, completeSubtask } = useListContext();
    const { user } = useAuth();
    const [currentTask, setCurrentTask] = useState<TaskType | undefined>(task);
    const [isSubtaskInputVisible, setIsSubtaskInputVisible] = useState<boolean>(false);
    const [subtaskTitle, setSubtaskTitle] = useState<string>("");

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

    useEffect(() => {
        setCurrentTask(listData.find((list: ListType) => list.IdList === currentListId)?.tasks.find((taskItem: TaskType) => taskItem.IdTask === currentTask?.IdTask));
    }, [listData]);


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

    const handleCompleteSubtask = (updatedSubtask: SubtaskType) => {
        completeSubtask(updatedSubtask);
    };


    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <NavigationTopBar
                    name={editTaskTranslation}
                    type={navigationTypes.NAVIGATION_TOP_BAR_TYPES.BASIC}
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
                        onPress={() => { }}
                        style={[styles.notificationButton, { borderBottomColor: theme.HINT }]}
                    >
                        <NotificationIcon
                            stroke={theme.TEXT}
                            strokeWidth={constants.STROKE_WIDTH.ICON}
                        />
                        <Text style={[{ color: theme.TEXT }, styles.notificationButtonText]}>
                            <FormattedMessage
                                id='views.authenticated.task.details.set-notification'
                                defaultMessage='Set notification'
                            />
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        onPress={() => { }}
                        style={[styles.notificationButton, { borderBottomColor: theme.HINT }]}
                    >
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
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        onPress={() => { }}
                        style={[styles.notificationButton, { borderBottomColor: theme.HINT }]}
                    >
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
                    </TouchableOpacity>
                </View>
            </View>
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
        gap: spacing.SCALE_10,
        borderBottomWidth: 1,
        paddingVertical: spacing.SCALE_16,

    },
    notificationButtonText: {
        fontSize: typography.FONT_SIZE_16,
    },
});