import { StyleSheet, FlatList, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { List, Task as TaskType } from 'data/types';
import Task from 'components/task';
import { useListContext } from 'context/DataProvider';

type TaskListProps = {
    tasks: TaskType[];
    listId: number;
};

export default function TaskList({ tasks, listId }: TaskListProps) {
    const { updateListData } = useListContext();
    const [currentTasks, setCurrentTasks] = useState<TaskType[]>([]);

    useEffect(() => {
        setCurrentTasks(tasks);
    }, [tasks]);

    const handleCompleteTask = (taskId: number) => {
        updateListData((prevListData: List[]) => {
            const updatedLists = prevListData.map((list: List) => {
                if (list.IdList === listId) {
                    const updatedTasks = list.tasks.map((task: TaskType) =>
                        task.IdTask === taskId ? { ...task, isCompleted: !task.isCompleted } : task
                    );

                    return { ...list, tasks: updatedTasks };
                } else {
                    return list;
                }
            });

            return updatedLists;
        });
    };



    return (
        <View>
            <FlatList
                data={currentTasks}
                keyExtractor={(item: TaskType) => item.IdTask.toString()}
                renderItem={({ item }: { item: TaskType }) => <Task listId={listId} task={item} onTaskComplete={() => handleCompleteTask(item.IdTask)} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({});
