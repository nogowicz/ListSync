import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { formatDateToLongDate } from 'utils/dateFormat';
import Button from 'components/button';

type TopPanelProps = {
    name: string;
};

export default function TopPanel({ name }: TopPanelProps) {
    const date = formatDateToLongDate(new Date());
    return (
        <View style={styles.container}>
            <View>
                <Text>Hi, {name}!</Text>
                <Text>{date}</Text>
            </View>
            <Button text="New List" type='add' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})