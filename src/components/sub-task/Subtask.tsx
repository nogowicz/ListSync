import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import Button, { buttonTypes } from 'components/button'
import { spacing, typography } from 'styles'
import { Subtask as SubtaskType } from 'data/types'
import { ThemeContext } from 'navigation/utils/ThemeProvider'

type SubtaskProps = {
    item: SubtaskType;
    handleCompleteSubtask: any;
};

export default function Subtask({ item, handleCompleteSubtask }: SubtaskProps) {
    const theme = useContext(ThemeContext);
    return (
        <View
            style={[styles.leftContainer, { marginVertical: spacing.SCALE_8, }]}
        >
            <Button
                type={buttonTypes.BUTTON_TYPES.CHECK}
                onPress={handleCompleteSubtask}
                isChecked={item.isCompleted}
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