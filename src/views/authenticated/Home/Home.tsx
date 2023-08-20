import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { spacing } from 'styles';
import { ListType } from 'data/types';
import { useListContext } from 'context/DataProvider';

//components:
import TopPanel from 'components/top-panel';
import FilterPanel from 'components/filter-panel';
import ListList from 'components/list-list';
import AddTaskField from 'components/add-task-field';
import { useUser } from 'context/UserProvider';
import { TOP_PANEL_TYPES } from 'components/top-panel/topPanelTypes';


type HomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'HOME'>;

type HomeProps = {
    navigation: HomeScreenNavigationProp['navigation'];
};


export default function Home({ navigation }: HomeProps) {
    const theme = useTheme();
    const { listData } = useListContext();
    const newList = listData.filter((item: ListType) => item.isArchived === false);
    const [list, setList] = useState<ListType[]>(newList);
    const { user, setUserDetails } = useUser();

    useEffect(() => {
        const filteredList = listData.filter((item: ListType) => item.isArchived === false);
        setList(filteredList);
    }, [listData]);


    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <TopPanel
                    type={TOP_PANEL_TYPES.HOME_SCREEN}
                />
                <FilterPanel setList={setList} />
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
