import { FlatList, View } from 'react-native'
import React from 'react'
import ListItem from 'components/list-item'
import { numColumns } from 'components/list-item/ListItem'
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from 'navigation/utils/screens';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { ListType } from 'data/types';


type ListListProps = {
    list: ListType[];
};

export default function ListList({ list }: ListListProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
            />
        </View>
    )
}
