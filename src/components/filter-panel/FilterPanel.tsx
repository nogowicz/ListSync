import { StyleSheet, ScrollView, View, } from 'react-native'
import React, { useContext, useState, Dispatch, SetStateAction } from 'react'
import Button, { buttonTypes } from 'components/button'
import { FormattedMessage } from 'react-intl'
import { spacing } from 'styles'
import { useTheme } from 'navigation/utils/ThemeProvider';
import { ListType } from 'data/types'
import { useListContext } from 'context/DataProvider'

type FilterPanelProps = {
    setList: Dispatch<SetStateAction<ListType[]>>;
};

export default function FilterPanel({ setList }: FilterPanelProps) {
    const theme = useTheme();
    const { listData } = useListContext();
    const [activeListName, setActiveListName] = useState('all');
    const allList = listData.filter((item: ListType) => item.isArchived === false);
    const favoriteList = listData.filter((item: ListType) => item.isFavorite === true && item.isArchived === false);
    const sharedList = listData.filter((item: ListType) => item.isShared === true && item.isArchived === false);
    const archivedList = listData.filter((item: ListType) => item.isArchived === true);


    const handleAllList = () => {
        setList(allList);
        setActiveListName('all');
    };

    const handleFavoriteList = () => {
        setList(favoriteList);
        setActiveListName('favorite');
    };

    const handleSharedList = () => {
        setList(sharedList);
        setActiveListName('shared');
    };

    const handleArchivedList = () => {
        setList(archivedList);
        setActiveListName('archived');
    };

    const filterButtons = [
        {
            type: buttonTypes.BUTTON_TYPES.FILTER,
            isActive: activeListName === 'favorite',
            onPress: handleFavoriteList,
            text: (
                <FormattedMessage
                    id='views.authenticated.home.filter-button-text-favorite'
                    defaultMessage={'Favorite'}
                />
            ),
            amount: favoriteList.length
        },
        {
            type: buttonTypes.BUTTON_TYPES.FILTER,
            isActive: activeListName === 'shared',
            onPress: handleSharedList,
            text: (
                <FormattedMessage
                    defaultMessage={'Shared'}
                    id='views.authenticated.home.filter-button-text-shared'
                />
            ),
            amount: sharedList.length
        },
        {
            type: buttonTypes.BUTTON_TYPES.FILTER,
            isActive: activeListName === 'archived',
            onPress: handleArchivedList,
            text: (
                <FormattedMessage
                    id='views.authenticated.home.filter-button-text-archived'
                    defaultMessage={'Archived'}
                />
            ),
            amount: archivedList.length
        }
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                <Button
                    type={buttonTypes.BUTTON_TYPES.FILTER}
                    isActive={activeListName === 'all'}
                    onPress={handleAllList}
                    text={
                        <FormattedMessage
                            id='views.authenticated.home.filter-button-text-all'
                            defaultMessage={'All'}
                        />
                    }
                    amount={allList.length}
                />

                <View style={[styles.separator, { backgroundColor: theme.LIGHT_HINT }]} />
                {filterButtons.map((button, index) => (
                    <Button
                        key={index}
                        type={button.type}
                        isActive={button.isActive}
                        onPress={button.onPress}
                        text={button.text}
                        amount={button.amount}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.SCALE_20,
    },
    separator: {
        height: spacing.SCALE_20,
        width: spacing.SCALE_2,
        marginRight: spacing.SCALE_12,
        alignSelf: 'center',
    },
})