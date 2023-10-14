import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button, { buttonTypes } from 'components/button'
import { SubtaskType } from 'data/types'
import { useTheme } from 'navigation/utils/ThemeProvider';
import { spacing, typography } from 'styles';
import { useListContext } from 'context/DataProvider';

//icons:
import CloseIcon from 'assets/button-icons/close.svg';

type SubtaskProps = {
    item: SubtaskType;
    handleCompleteSubtask: any;
    color: string;
    deleteButton?: boolean;
    listId?: number;
};

export default function Subtask({
    item,
    handleCompleteSubtask,
    color,
    deleteButton = false,
    listId,
}: SubtaskProps) {
    const theme = useTheme();
    const { deleteSubtask } = useListContext();

    function handleDeleteSubtask() {
        if (listId) {
            deleteSubtask(item.idSubtask, item.idTask, listId);
        }
    }


    return (

        <View
            style={[styles.subtask, { marginVertical: spacing.SCALE_8, }]}
        >
            <View style={[styles.subtaskLeftContainer, { marginVertical: spacing.SCALE_8, }]}>
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
            {deleteButton &&
                <Button
                    icon={<CloseIcon />}
                    onPress={handleDeleteSubtask}
                    type={buttonTypes.BUTTON_TYPES.WITH_ICON}
                    color={color}
                />}

        </View>

    )
}

const styles = StyleSheet.create({
    subtask: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subtaskLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: typography.FONT_SIZE_16,
    },

})