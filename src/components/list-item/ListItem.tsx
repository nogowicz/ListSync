import React, { cloneElement } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';
import { FormattedMessage } from 'react-intl';
import { listColorTheme, listIconTheme } from 'styles/list-styles';

import SharedList from 'assets/button-icons/shared-list.svg';
import FavoriteList from 'assets/button-icons/favorite.svg';


type ListItemProps = {
    listName: string;
    taskAmount: number;
    listIcon?: number;
    isFavorite?: boolean;
    isShared?: boolean;
    activeOpacity?: number;
    onPress?: () => void;
    isLastItemInRow?: boolean;
    isSingleItemInRow?: boolean;
    colorVariant: number;
};
export const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemSize = (screenWidth - (spacing.SCALE_22 * 2) - (spacing.SCALE_22 * (numColumns - 1))) / numColumns;


export default function ListItem({
    listName,
    taskAmount,
    listIcon = 1,
    isFavorite = false,
    isShared = false,
    activeOpacity = constants.ACTIVE_OPACITY.HIGH,
    colorVariant,
    onPress,
}: ListItemProps) {
    const theme = useTheme();
    const tasks = taskAmount !== 1 ?
        (taskAmount > 4 || taskAmount === 0 ?
            (<FormattedMessage
                defaultMessage="tasks"
                id='views.authenticated.home.list-item.tasks'
            />) :
            (<FormattedMessage
                defaultMessage="tasks"
                id='views.authenticated.home.list-item.tasks_more-than-four'
            />
            )) :
        (<FormattedMessage
            defaultMessage="task"
            id='views.authenticated.home.list-item.task'
        />);


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
                    backgroundColor: theme.FIXED_COMPONENT_COLOR,
                },
            ]}
            activeOpacity={activeOpacity}
            onPress={onPress}
        >
            <View style={styles.iconContainer}>
                <View style={{ marginLeft: spacing.SCALE_6, }}>
                    {cloneElement(listIconTheme[listIcon] as any, { fill: listColorTheme[colorVariant] })}
                </View>
                <View style={styles.favoriteAndSharedContainer}>
                    {isShared &&
                        <SharedList
                            stroke={theme.YELLOW}
                            strokeWidth={constants.STROKE_WIDTH.ICON}
                        />}
                    {isFavorite &&
                        <FavoriteList
                            stroke={theme.FIXED_PRIMARY_BLUE}
                            strokeWidth={constants.STROKE_WIDTH.ICON}
                        />}
                </View>
            </View>
            <Text style={[{ color: theme.TEXT, fontSize }]}>
                {listName === "All" ?
                    <FormattedMessage
                        id='views.authenticated.home.text-input.list-name.all'
                        defaultMessage={'All'}
                    /> :
                    listName
                }
            </Text>
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
        elevation: spacing.SCALE_4,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        flex: 1,
        margin: spacing.SCALE_7,
        width: itemSize,
        height: itemSize,
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
    },
});
