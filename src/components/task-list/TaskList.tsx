import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TaskType } from 'data/types';
import Task from 'components/task';
import { useListContext } from 'context/DataProvider';
import notifee, { EventType } from '@notifee/react-native';
import { useNotification } from 'hooks/useNotification';

type TaskListProps = {
    tasks: TaskType[];
    listId: number;
    color: string;
};

export default function TaskList({ tasks, listId, color }: TaskListProps) {
    const { completeTask } = useListContext();
    const [currentTasks, setCurrentTasks] = useState<TaskType[]>([]);
    const { cancelNotification } = useNotification();

    useEffect(() => {
        setCurrentTasks(tasks);
    }, [tasks]);

    const handleCompleteTask = (taskId: number) => {
        const taskToUpdate = tasks.find((task) => task.idTask === taskId);

        if (taskToUpdate) {
            completeTask(taskToUpdate).then(() => {
                cancelNotification(String(taskId));
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
                    key={item.idTask}
                    listId={listId}
                    task={item}
                    color={color}
                    onTaskComplete={() => handleCompleteTask(item.idTask)}
                />
            )
            )}
        </View>
    );
}

