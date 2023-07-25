import React, { ReactNode, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';

import SharedList from 'assets/button-icons/shared-list.svg';
import FavoriteList from 'assets/button-icons/favorite.svg';

import ListDefault from 'assets/list-icons/list-default.svg'
import ListIcon from 'assets/list-icons/list-icon.svg';
import ShoppingCart from 'assets/list-icons/shopping-cart.svg';

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

const icon: any = {
    1: (<ListDefault fill='#0860FB' />),
    2: (<ListIcon />),
    3: (<ShoppingCart />)
};

export default function ListItem({
    listName,
    taskAmount,
    listIcon = 1,
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
                    {icon[listIcon]}
                </View>
                <View style={styles.favoriteAndSharedContainer}>
                    {isShared && <SharedList />}
                    {isFavorite && <FavoriteList />}
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
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    }
});
