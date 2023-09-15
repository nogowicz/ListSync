import { StyleSheet, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { spacing, typography } from 'styles'
import { useTheme } from 'navigation/utils/ThemeProvider'
import NavigationTopBar, { navigationTypes } from 'components/navigation-top-bar';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'navigation/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIntl } from 'react-intl';
import Button, { buttonTypes } from 'components/button';
import { useListContext } from 'context/DataProvider';
import { ListType, TaskType } from 'data/types';
import list from '../list';



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
    const { listData, completeTask } = useListContext();
    const [currentTask, setCurrentTask] = useState<TaskType | undefined>(task);

    //translations:
    const editTaskTranslation = intl.formatMessage({
        defaultMessage: "Edit task",
        id: "views.authenticated.task.details.edit-task"
    });
    const taskTitlePlaceholderTranslation = intl.formatMessage({
        id: "views.authenticated.task.details.task-title-placeholder",
        defaultMessage: "Task name"
    })

    useEffect(() => {
        setCurrentTask(listData.find((list: ListType) => list.IdList === currentListId)?.tasks.find((taskItem: TaskType) => taskItem.IdTask === currentTask?.IdTask));
    }, [listData])


    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <NavigationTopBar
                    name={editTaskTranslation}
                    type={navigationTypes.NAVIGATION_TOP_BAR_TYPES.BASIC}
                />
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
                    />
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
    taskTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInputStyle: {
        fontSize: typography.FONT_SIZE_18,
        flex: 1,
    }

})