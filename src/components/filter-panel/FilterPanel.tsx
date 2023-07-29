import { StyleSheet, ScrollView, View, } from 'react-native'
import React, { useContext, useState, Dispatch, SetStateAction } from 'react'
import Button, { buttonTypes } from 'components/button'
import { FormattedMessage } from 'react-intl'
import { spacing } from 'styles'
import { ThemeContext } from 'navigation/utils/ThemeProvider'
import { List } from 'data/types'
import { useListContext } from 'context/DataProvider'

type FilterPanelProps = {
    setList: Dispatch<SetStateAction<List[]>>;
};

export default function FilterPanel({ setList }: FilterPanelProps) {
    const theme = useContext(ThemeContext);
    const { listData } = useListContext();
    const [activeListName, setActiveListName] = useState('all');
    const allList = listData.filter((item: List) => item.isArchived === false);
    const favoriteList = listData.filter((item: List) => item.isFavorite === true && item.isArchived === false);
    const sharedList = listData.filter((item: List) => item.isShared === true && item.isArchived === false);
    const archivedList = listData.filter((item: List) => item.isArchived === true);


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

                <Button
                    type={buttonTypes.BUTTON_TYPES.FILTER}
                    isActive={activeListName === 'favorite'}
                    onPress={handleFavoriteList}
                    text={
                        <FormattedMessage
                            id='views.authenticated.home.filter-button-text-favorite'
                            defaultMessage={'Favorite'}
                        />
                    }
                    amount={favoriteList.length}
                />
                <Button
                    type={buttonTypes.BUTTON_TYPES.FILTER}
                    isActive={activeListName === 'shared'}
                    onPress={handleSharedList}
                    text={
                        <FormattedMessage
                            defaultMessage={'Shared'}
                            id='views.authenticated.home.filter-button-text-shared'
                        />
                    }
                    amount={sharedList.length}
                />
                <Button
                    type={buttonTypes.BUTTON_TYPES.FILTER}
                    isActive={activeListName === 'archived'}
                    onPress={handleArchivedList}
                    text={
                        <FormattedMessage
                            id='views.authenticated.home.filter-button-text-archived'
                            defaultMessage={'Archived'}
                        />
                    }
                    amount={archivedList.length}
                />
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
    }
})