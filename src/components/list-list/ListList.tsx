import { FlatList, View, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import ListItem from 'components/list-item'
import { numColumns } from 'components/list-item/ListItem'
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from 'navigation/utils/screens';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { ListType } from 'data/types';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { useListContext } from 'context/DataProvider';


type ListListProps = {
    list: ListType[];
};

export default function ListList({ list }: ListListProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [refreshing, setRefreshing] = useState(false);
    const theme = useTheme();
    const { fetchUserLists } = useListContext();

    const onRefresh = useCallback(() => {
        fetchUserLists();
    }, []);


    const renderItem = ({ item, index }: { item: ListType; index: number }) => {
        const filteredTaskAmount = item.tasks.filter(task => !task.isCompleted).length;
        return (
            <View>
                <ListItem
                    listName={item.listName}
                    taskAmount={filteredTaskAmount}
                    isShared={item.isShared}
                    isFavorite={item.isFavorite}
                    listIcon={item.iconId}
                    colorVariant={item.colorVariant}
                    onPress={() =>
                        navigation.navigate(SCREENS.AUTHENTICATED.LIST.ID, {
                            currentListId: item.idList,
                        } as any)
                    }
                />
            </View>
        );
    };


    return (
        <View style={{ flex: 1, }}>
            <FlatList
                data={list}
                keyExtractor={(item: ListType) => item.idList.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                numColumns={numColumns}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.PRIMARY, theme.RED, theme.GREEN]}
                        progressBackgroundColor={theme.SECONDARY}
                    />
                }
            />
        </View>
    )
}
