import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ListItem from 'components/list-item'
import { numColumns } from 'components/list-item/ListItem'
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from 'navigation/utils/screens';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';


type ListListProps = {
    list: any;
};

export default function ListList({ list }: ListListProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return (
        <View style={{ flex: 1, }}>
            <FlatList
                data={list}
                keyExtractor={(item: any) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }: any) => (
                    <View>
                        <ListItem
                            listName={item.title}
                            taskAmount={item.taskAmount}
                            isShared={item.isShared}
                            isFavorite={item.isFavorite}
                            listIcon={item.listIcon}
                            onPress={() => navigation.navigate(SCREENS.AUTHENTICATED.LIST.ID)}
                        />
                    </View>
                )}
                numColumns={numColumns}
            />
        </View>
    )
}

const styles = StyleSheet.create({})