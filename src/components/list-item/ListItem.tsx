import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import ListIcon from 'assets/button-icons/list.svg';
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';

type ListItemProps = {
    listName: string;
    taskAmount: number;
    listIcon?: any;
    isFavorite?: boolean;
    isShared?: boolean;
    activeOpacity?: number;
    onPress?: () => void;
    isLastItemInRow?: boolean;
    isSingleItemInRow?: boolean;
};
export const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemSize = (screenWidth - (spacing.SCALE_22 * 2) - (spacing.SCALE_22 * (numColumns - 1))) / numColumns;

export default function ListItem({
    listName,
    taskAmount,
    listIcon = (
        <ListIcon stroke='#0860FB' strokeWidth={2} />
    ),
    isFavorite = false,
    isShared = false,
    activeOpacity = 0.7,
    onPress,
}: ListItemProps) {
    const theme = useContext(ThemeContext);
    const tasks = taskAmount !== 1 ? "tasks" : "task";


    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: theme.SECONDARY,
                },
            ]}
            activeOpacity={activeOpacity}
            onPress={onPress}
        >
            <View style={styles.iconContainer}>
                {listIcon}
            </View>
            <Text style={[styles.listName, { color: theme.TEXT }]}>{listName}</Text>
            <Text style={[styles.taskAmount, { color: theme.HINT }]}>{taskAmount} {tasks}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: constants.BORDER_RADIUS.BUTTON,
        flex: 1,
        margin: spacing.SCALE_7,
        width: itemSize,
        height: itemSize,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        elevation: spacing.SCALE_4,
        padding: spacing.SCALE_16,
        justifyContent: 'space-between'
    },
    listName: {
        fontSize: typography.FONT_SIZE_24,
    },
    taskAmount: {
        fontSize: typography.FONT_SIZE_16,
    },
    iconContainer: {
        marginLeft: -spacing.SCALE_12,
    },
    lastItemInRow: {
        marginRight: 0,
    },
});
