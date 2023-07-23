import { StyleSheet, ScrollView, View, } from 'react-native'
import React, { useContext, useState } from 'react'
import Button from 'components/button'
import { FormattedMessage } from 'react-intl'
import { spacing } from 'styles'
import { ThemeContext } from 'navigation/utils/ThemeProvider'

type FilterPanelProps = {
    data: any;
    setList: any;
};

export default function FilterPanel({ data, setList }: FilterPanelProps) {
    const theme = useContext(ThemeContext);
    const [activeListName, setActiveListName] = useState('all');
    const allList = data.filter((item: any) => item.isArchived === false);
    const favoriteList = data.filter((item: any) => item.isFavorite === true && item.isArchived === false);
    const sharedList = data.filter((item: any) => item.isShared === true && item.isArchived === false);
    const archivedList = data.filter((item: any) => item.isArchived === true);


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
                    type='filter'
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
                    type='filter'
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
                    type='filter'
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
                    type='filter'
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