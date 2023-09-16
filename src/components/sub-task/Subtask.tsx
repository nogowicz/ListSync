import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button, { buttonTypes } from 'components/button'
import { spacing, typography } from 'styles'
import { SubtaskType } from 'data/types'
import { useTheme } from 'navigation/utils/ThemeProvider';

type SubtaskProps = {
    item: SubtaskType;
    handleCompleteSubtask: any;
    color: string;
};

export default function Subtask({ item, handleCompleteSubtask, color }: SubtaskProps) {
    const theme = useTheme();
    return (
        <View
            style={[styles.leftContainer, { marginVertical: spacing.SCALE_8, }]}
        >
            <Button
                type={buttonTypes.BUTTON_TYPES.CHECK}
                onPress={handleCompleteSubtask}
                isChecked={item.isCompleted}
                color={color}
            />
            <Text style={[
                styles.text,
                item.isCompleted ?
                    {
                        color: theme.HINT,
                        textDecorationLine: 'line-through',
                    } :
                    {
                        color: theme.TEXT,
                    }]}>{item.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: typography.FONT_SIZE_16,
    },
})