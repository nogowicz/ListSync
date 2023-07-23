import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';

import ListDefault from 'assets/list-icons/list-default.svg'
import SharedList from 'assets/button-icons/shared-list.svg';
import FavoriteList from 'assets/button-icons/favorite.svg';

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
        <ListDefault fill={'#0860FB'} />
    ),
    isFavorite = false,
    isShared = false,
    activeOpacity = 0.7,
    onPress,
}: ListItemProps) {
    const theme = useContext(ThemeContext);
    const tasks = taskAmount !== 1 ? "tasks" : "task";


    const getFontSize = (textLength: number) => {
        if (textLength <= 10) {
            return typography.FONT_SIZE_24;
        } else if (textLength > 10 && textLength <= 20) {
            return typography.FONT_SIZE_20;
        } else {
            return typography.FONT_SIZE_14;
        }
    };

    const fontSize = getFontSize(listName.length);

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
                <View style={{ marginLeft: spacing.SCALE_6, }}>
                    {listIcon}
                </View>
                <View style={styles.favoriteAndSharedContainer}>
                    {isFavorite && <FavoriteList />}
                    {isShared && <SharedList />}
                </View>
            </View>
            <Text style={[{ color: theme.TEXT, fontSize }]}>{listName}</Text>
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
    taskAmount: {
        fontSize: typography.FONT_SIZE_16,
    },
    iconContainer: {
        marginLeft: -spacing.SCALE_12,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    lastItemInRow: {
        marginRight: 0,
    },
    favoriteAndSharedContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    }
});
