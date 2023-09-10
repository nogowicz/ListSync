import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ListType, TaskType } from 'data/types';
import Task from 'components/task';
import { useListContext } from 'context/DataProvider';
import { updateTaskInDatabase } from 'utils/database';
import notifee, { EventType } from '@notifee/react-native';
import { useNotification } from 'hooks/useNotification';

type TaskListProps = {
    tasks: TaskType[];
    listId: number;
    color: string;
};

export default function TaskList({ tasks, listId, color }: TaskListProps) {
    const { updateListData } = useListContext();
    const [currentTasks, setCurrentTasks] = useState<TaskType[]>([]);
    const { cancelNotification } = useNotification();

    useEffect(() => {
        setCurrentTasks(tasks);
    }, [tasks]);

    const handleCompleteTask = (taskId: number) => {
        const taskToUpdate = tasks.find((task) => task.IdTask === taskId);

        if (taskToUpdate) {
            const updatedIsCompleted = !taskToUpdate.isCompleted;

            updateTaskInDatabase(
                taskId,
                taskToUpdate.title,
                updatedIsCompleted,
                taskToUpdate.deadline,
                taskToUpdate.importance,
                taskToUpdate.effort,
                taskToUpdate.note,
                taskToUpdate.assignedTo
            ).then(() => {
                cancelNotification(String(taskId));
                updateListData((prevListData: ListType[]) => {
                    const updatedLists = prevListData.map((list: ListType) => {
                        const updatedTasks = list.tasks.map((task: TaskType) =>
                            task.IdTask === taskId ? { ...task, isCompleted: updatedIsCompleted } : task
                        );

                        return { ...list, tasks: updatedTasks };
                    });

                    return updatedLists;
                });
            }).catch((error) => {
                console.error('Error updating task in the database:', error);
            });
        }
    };
    notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.ACTION_PRESS && detail.pressAction && detail.pressAction.id === 'complete-task') {
            if (detail.notification && detail.notification.data) {
                const taskId: number = Number(detail.notification.data.taskId);
                handleCompleteTask(taskId);
            }
        }
    });

    notifee.onForegroundEvent(async ({ type, detail }) => {
        if (type === EventType.ACTION_PRESS && detail.pressAction && detail.pressAction.id === 'complete-task') {

            if (detail.notification && detail.notification.data) {
                const taskId: number = Number(detail.notification.data.taskId);
                handleCompleteTask(taskId);
            }
        }
    });


    return (
        <View style={{ flex: 1 }}>
            {currentTasks.map((item: TaskType) => (
                <Task
                    key={item.IdTask}
                    listId={listId}
                    task={item}
                    color={color}
                    onTaskComplete={() => handleCompleteTask(item.IdTask)}
                />
            )
            )}
        </View>
    );
}

