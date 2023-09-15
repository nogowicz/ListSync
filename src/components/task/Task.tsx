import { Platform, StyleSheet, Text, TouchableOpacity, View, LayoutAnimation } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';
import Button, { buttonTypes } from 'components/button';
import { ListType, SubtaskType, TaskType } from 'data/types';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Arrow from 'assets/button-icons/Back.svg';
import SubtaskTree from 'assets/button-icons/subtasks-icon.svg';
import Calendar from 'assets/button-icons/calendar-input-selection.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { formatDateToShortDate, isToday, isTomorrow } from 'utils/dateFormat';
import { toggleAnimation } from './helpers';
import SubTask from 'components/sub-task';
import { useListContext } from 'context/DataProvider';
import { deadlineNames } from 'components/add-task-field/DeadlineSelector';
import { Swipeable } from 'react-native-gesture-handler';

//icons:
import Trash from 'assets/button-icons/trash.svg';
import Done from 'assets/button-icons/done.svg';
import { useNotification } from 'hooks/useNotification';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from 'navigation/utils/screens';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from 'navigation/navigation';

type TaskProps = {
    task: TaskType;
    onTaskComplete: any;
    listId: number;
    color: string;
};


export default function Task({ task, onTaskComplete, listId, color }: TaskProps) {
    const theme = useTheme();
    const intl = useIntl();
    const { cancelNotification } = useNotification();
    const isCompleted = task.isCompleted;
    const subTasks: SubtaskType[] = task.subtasks;
    const completedSubTasks: SubtaskType[] = subTasks.filter(item => item.isCompleted);
    const hasDeadline = task.deadline;
    const deadline = new Date(task.deadline as string);
    const deadlineAsString = formatDateToShortDate(deadline, intl);
    const [isSubtasksVisible, setIsSubtasksVisible] = useState(false);
    const rotateAnimation = useSharedValue(isSubtasksVisible ? -90 : -180);
    const { completeSubtask, deleteTask } = useListContext();
    const now = new Date();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const rotateStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotateAnimation.value}deg` }],
        };
    });

    const deadlineColor = () => {
        if (deadline < now) {
            return theme.DARK_RED;
        } else if (deadline.toDateString() === now.toDateString()) {
            return theme.YELLOW;
        } else {
            return theme.GREEN;
        }
    };


    const handleArrowPress = () => {
        setIsSubtasksVisible(!isSubtasksVisible);
        const targetRotation = isSubtasksVisible ? -180 : -90;
        rotateAnimation.value = withTiming(targetRotation, {
            duration: 200,
            easing: Easing.ease,
        });
        LayoutAnimation.configureNext(toggleAnimation);
    };

    const [sortedSubTasks, setSortedSubTasks] = useState<SubtaskType[]>([]);

    useEffect(() => {
        const sortedTasks = [...subTasks].sort((a, b) => {
            if (a.isCompleted && !b.isCompleted) {
                return 1;
            } else if (!a.isCompleted && b.isCompleted) {
                return -1;
            } else {
                return 0;
            }
        });
        setSortedSubTasks(sortedTasks);
    }, [subTasks]);

    const handleCompleteSubtask = (updatedSubtask: SubtaskType) => {
        completeSubtask(updatedSubtask);
    };

    const handleDeleteTask = async () => {
        try {
            await deleteTask(task.IdTask, listId).then(() => {
                cancelNotification(String(task.IdTask));
            })

        } catch (error) {
            console.error('Error removing task:', error);
        }
    };


    const RenderRight = () => {
        return (
            <View style={[styles.hiddenItemRightContainer, { backgroundColor: theme.DARK_RED }]}>
                <Animated.View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Trash stroke={theme.WHITE} strokeWidth={constants.STROKE_WIDTH.ICON} />
                    <Text style={[styles.hiddenItemText, { color: theme.WHITE }]}>
                        <FormattedMessage defaultMessage="Delete" id="view.authenticated.task.delete" />
                    </Text>
                </Animated.View>
            </View>
        );
    };

    const RenderLeft = () => {
        return (
            <View style={[styles.hiddenItemLeftContainer, { backgroundColor: color }]}>
                <Animated.View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Done stroke={theme.WHITE} strokeWidth={constants.STROKE_WIDTH.ICON} />
                    <Text style={[styles.hiddenItemText, { color: theme.WHITE }]}>
                        {task.isCompleted ?
                            <FormattedMessage defaultMessage="Undone" id="view.authenticated.task.un-done" /> :
                            <FormattedMessage defaultMessage="Done" id="view.authenticated.task.done" />}
                    </Text>
                </Animated.View>
            </View>

        );
    };

    function onSwipeableOpen(direction: "left" | "right", swipeable: Swipeable) {
        if (direction === "left") {
            onTaskComplete();
        } else if (direction === 'right') {
            handleDeleteTask();
        }
    }


    return (
        <Swipeable
            overshootRight={false}
            renderLeftActions={RenderLeft}
            renderRightActions={RenderRight}
            onSwipeableOpen={onSwipeableOpen}
        >
            <TouchableOpacity
                style={[styles.container, { backgroundColor: theme.FIXED_COMPONENT_COLOR }]}
                activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                onPress={() => navigation.navigate(SCREENS.AUTHENTICATED.TASK_DETAILS.ID, {
                    task: task,
                    color: color,
                    currentListId: listId
                })}
            >
                <View style={styles.upperContainer}>
                    <View style={styles.leftContainer}>
                        <Button
                            type={buttonTypes.BUTTON_TYPES.CHECK}
                            onPress={onTaskComplete}
                            isChecked={isCompleted}
                            color={color}
                        />
                        <Text style={[
                            styles.text,
                            isCompleted ?
                                {
                                    color: theme.HINT,
                                    textDecorationLine: 'line-through',
                                } :
                                {
                                    color: theme.TEXT,
                                }]}>{task.title}</Text>
                    </View>
                    {subTasks.length > 0 &&
                        <TouchableOpacity
                            activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                            onPress={handleArrowPress}
                            style={{ height: '100%', paddingLeft: spacing.SCALE_18 }}
                        >
                            <Animated.View style={[rotateStyle]}>
                                <Arrow
                                    width={constants.ICON_SIZE.SUBTASK_ARROW}
                                    height={constants.ICON_SIZE.SUBTASK_ARROW}
                                    fill={theme.TEXT}
                                />
                            </Animated.View>
                        </TouchableOpacity>}
                </View>
                <View style={styles.middleContainer}>
                    {subTasks.length > 0 &&
                        <View style={styles.middleContainer}>
                            <SubtaskTree
                                width={constants.ICON_SIZE.SUBTASK_TREE}
                                height={constants.ICON_SIZE.SUBTASK_TREE}
                            />
                            <Text style={[styles.subtasksAmount, { color: theme.HINT }]}>
                                {completedSubTasks.length} / {subTasks.length}
                            </Text>
                        </View>}
                    {hasDeadline !== null &&
                        <View style={styles.middleContainer}>
                            <Calendar
                                width={constants.ICON_SIZE.SUBTASK_TREE}
                                height={constants.ICON_SIZE.SUBTASK_TREE}
                                fill={deadlineColor()}
                            />
                            <Text style={[styles.subtasksAmount, { color: deadlineColor() }]}>
                                {isToday(deadline) ? deadlineNames.TODAY :
                                    (isTomorrow(deadline) ? deadlineNames.TOMORROW : deadlineAsString)
                                }
                            </Text>
                        </View>}

                </View>

                {(subTasks.length > 0 && isSubtasksVisible) &&
                    <Animated.View
                        style={[styles.subtasks]}
                    >
                        {sortedSubTasks.map((item: SubtaskType) => (
                            <SubTask
                                key={item.idSubtask}
                                handleCompleteSubtask={() => handleCompleteSubtask(item)}
                                item={item}
                            />)
                        )
                        }
                    </Animated.View>}

            </TouchableOpacity>
        </Swipeable>
    );

}



const styles = StyleSheet.create({
    container: {
        paddingTop: spacing.SCALE_16,
        paddingBottom: spacing.SCALE_12,
        paddingHorizontal: spacing.SCALE_16,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: constants.BORDER_RADIUS.BUTTON,
        elevation: spacing.SCALE_4,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        marginVertical: spacing.SCALE_8,
        marginHorizontal: spacing.SCALE_2,

    },
    upperContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    middleContainer: {
        flexDirection: 'row',
        gap: spacing.SCALE_8,
        alignItems: 'center',
        marginTop: spacing.SCALE_8,
    },
    text: {
        fontSize: typography.FONT_SIZE_16,
    },
    subtasksAmount: {
        fontSize: typography.FONT_SIZE_12,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    subtasks: {
        marginTop: spacing.SCALE_20,
        marginLeft: spacing.SCALE_30,
        overflow: 'hidden',
    },
    hiddenItemRightContainer: {
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: spacing.SCALE_22,
        alignItems: 'flex-end',
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        marginVertical: spacing.SCALE_8,
        marginRight: spacing.SCALE_2,

    },

    hiddenItemText: {
        fontSize: typography.FONT_SIZE_16,
    },

    hiddenItemLeftContainer: {
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: spacing.SCALE_22,
        alignItems: 'flex-start',
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        marginVertical: spacing.SCALE_8,
        marginLeft: spacing.SCALE_2,
    }
})