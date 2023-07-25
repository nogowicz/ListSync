import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';
import Button from 'components/button';

type TaskProps = {
    task: any;
};

export default function Task({ task }: TaskProps) {
    const theme = useContext(ThemeContext);
    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
            <Button type='check' onPress={() => console.log("Pressed")} />
            <Text style={[styles.text, { color: theme.TEXT }]}>{task.item.title}</Text>
        </View>
    )
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: typography.FONT_SIZE_16,
    }
})