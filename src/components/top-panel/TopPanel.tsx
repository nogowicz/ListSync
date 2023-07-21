import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { formatDateToLongDate } from 'utils/dateFormat';
import Button from 'components/button';
import { typography } from 'styles';
import { ThemeContext } from 'navigation/utils/ThemeProvider';

type TopPanelProps = {
    name: string;
};

export default function TopPanel({ name }: TopPanelProps) {
    const date = formatDateToLongDate(new Date());
    const theme = useContext(ThemeContext);
    return (
        <View style={styles.container}>
            <View>
                <Text style={[styles.greetingText, { color: theme.TEXT }]}>Hi, {name}!</Text>
                <Text style={[styles.dateText, { color: theme.HINT }]}>{date}</Text>
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
    greetingText: {
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_18,
    },
    dateText: {
        fontSize: typography.FONT_SIZE_15,
    },
})