import { StyleSheet, FlatList, View } from 'react-native';
import React from 'react';
import { Task as TaskType } from 'data/types';
import Task from 'components/task';

type TaskListProps = {
    tasks: TaskType[];
};

export default function TaskList({ tasks }: TaskListProps) {
    return (
        <View>
            <FlatList
                data={tasks}
                keyExtractor={(item: TaskType) => item.IdTask.toString()}
                renderItem={({ item }: { item: TaskType }) => <Task task={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({});
