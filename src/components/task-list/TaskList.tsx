import { StyleSheet, FlatList, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ListType, TaskType } from 'data/types';
import Task from 'components/task';
import { useListContext } from 'context/DataProvider';
import { updateTaskInDatabase } from 'utils/database';

type TaskListProps = {
    tasks: TaskType[];
    listId: number;
    color: string;
};

export default function TaskList({ tasks, listId, color }: TaskListProps) {
    const { updateListData } = useListContext();
    const [currentTasks, setCurrentTasks] = useState<TaskType[]>([]);

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

const styles = StyleSheet.create({});
