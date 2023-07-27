import { Platform, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';
import Button, { buttonTypes } from 'components/button';
import { Subtask, Task as TaskType } from 'data/types';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Arrow from 'assets/button-icons/Back.svg';
import SubtaskTree from 'assets/button-icons/subtasks-icon.svg';
import Calendar from 'assets/button-icons/calendar-input-selection.svg';
import { useIntl } from 'react-intl';
import { getDayName } from 'utils/dateFormat';

type TaskProps = {
    task: TaskType;
};

export default function Task({ task }: TaskProps) {
    const theme = useContext(ThemeContext);
    const intl = useIntl();
    const isCompleted = task.isCompleted;
    const [isSubtasksVisible, setIsSubtasksVisible] = useState(true);
    const subTasks: Subtask[] = task.subtasks;
    const completedSubTasks: Subtask[] = subTasks.filter(item => item.isCompleted);
    const hasDeadline = task.deadline;
    const deadline = new Date(task.deadline as string);
    const deadlineDayName = getDayName(deadline.getDay(), intl);
    const rotateAnimation = useSharedValue(isSubtasksVisible ? -90 : -180);
    const now = new Date();
    const deadlineColor = () => {
        if (deadline < now) {
            return theme.RED;
        } else if (deadline.toDateString() === now.toDateString()) {
            return theme.YELLOW;
        } else {
            return theme.GREEN;
        }
    };



    const rotateStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotateAnimation.value}deg` }],
        };
    });

    const handleArrowPress = () => {
        const targetRotation = isSubtasksVisible ? -180 : -90;
        rotateAnimation.value = withTiming(targetRotation, {
            duration: 200,
            easing: Easing.ease,
        });
        setIsSubtasksVisible(!isSubtasksVisible);
    };




    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.upperContainer}>
                <View style={styles.leftContainer}>
                    <Button
                        type={buttonTypes.BUTTON_TYPES.CHECK}
                        onPress={() => console.log("Pressed")}
                        isChecked={isCompleted}
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
                            {deadlineDayName}
                        </Text>
                    </View>}

            </View>

            {(subTasks.length > 0 && isSubtasksVisible) &&
                <View style={styles.subtasks}>
                    <FlatList
                        data={subTasks}
                        keyExtractor={(item: Subtask) => item.idSubtask.toString()}
                        renderItem={({ item }: { item: Subtask }) => {
                            return (
                                <View style={[styles.leftContainer, { marginVertical: spacing.SCALE_8, }]}>
                                    <Button
                                        type={buttonTypes.BUTTON_TYPES.CHECK}
                                        onPress={() => console.log("Pressed")}
                                        isChecked={item.isCompleted}
                                    />
                                    <Text style={[
                                        styles.text,
                                        item.isCompleted ?
                                            {
                                                color: theme.HINT,
                                                textDecorationLine: 'line-through',
                                            } :
                                            {
                                                color: theme.TEXT,
                                            }]}>{item.title}</Text>
                                </View>
                            )
                        }
                        }
                    />
                </View>}

        </View>
    );

}



const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.SCALE_12,
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
    }
})