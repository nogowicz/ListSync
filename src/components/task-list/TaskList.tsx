import { StyleSheet, FlatList, View } from 'react-native'
import React from 'react'
import Task from 'components/task';

type TaskListProps = {
    tasks: any;
}

export default function TaskList({ tasks }: TaskListProps) {
    return (
        <View>
            <FlatList
                key={tasks.IdTask}
                data={tasks}
                renderItem={(task) => <Task task={task} />}
            />
        </View>
    )
}

const styles = StyleSheet.create({})