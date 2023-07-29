import { FlatList, StyleSheet, View } from 'react-native'
import React, { useContext, Dispatch, SetStateAction } from 'react'
import ListItem from 'components/list-item'
import { numColumns } from 'components/list-item/ListItem'
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from 'navigation/utils/screens';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { List } from 'data/types';
import { ThemeContext } from 'navigation/utils/ThemeProvider';


type ListListProps = {
    list: List[];
};

export default function ListList({ list }: ListListProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const renderItem = ({ item, index }: { item: List; index: number }) => {
        return (
            <View>
                <ListItem
                    listName={item.listName}
                    taskAmount={item.tasks.length}
                    isShared={item.isShared}
                    isFavorite={item.isFavorite}
                    listIcon={item.iconId}
                    colorVariant={item.colorVariant}
                    onPress={() =>
                        navigation.navigate(SCREENS.AUTHENTICATED.LIST.ID, {
                            data: item,
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
                keyExtractor={(item: List) => item.IdList.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                numColumns={numColumns}
            />
        </View>
    )
}

const styles = StyleSheet.create({

})