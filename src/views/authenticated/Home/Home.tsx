import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { spacing } from 'styles';
import { ListType } from 'data/types';
import { useListContext } from 'context/DataProvider';
import { topPanelTypes } from 'components/top-panel';

//components:
import TopPanel from 'components/top-panel';
import FilterPanel from 'components/filter-panel';
import ListList from 'components/list-list';
import AddTaskField from 'components/add-task-field';
import ActivityIndicator from 'components/activity-indicator';


type HomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'HOME'>;

type HomeProps = {
    navigation: HomeScreenNavigationProp['navigation'];
};


export default function Home({ navigation }: HomeProps) {
    const theme = useTheme();
    const { listData, isLoadingData } = useListContext();
    const newList = listData.filter((item: ListType) => item.isArchived === false);
    const [list, setList] = useState<ListType[]>(newList);

    useLayoutEffect(() => {
        const filteredList = listData.filter((item: ListType) => item.isArchived === false);
        setList(filteredList);
    }, [listData]);


    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <TopPanel
                    type={topPanelTypes.TOP_PANEL_TYPES.HOME_SCREEN}
                />
                <FilterPanel setList={setList} />
                {isLoadingData ?
                    <ActivityIndicator /> : null}
                <ListList list={list} />
                <AddTaskField
                    currentListId={1}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        marginHorizontal: spacing.SCALE_20,
        marginTop: spacing.SCALE_20,
        flex: 1,
    }

});
