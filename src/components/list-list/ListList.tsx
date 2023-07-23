import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ListItem from 'components/list-item'
import { numColumns } from 'components/list-item/ListItem'

import ShoppingCart from 'assets/list-icons/shopping-cart.svg';
import ListIcon from 'assets/list-icons/list-iconsvg.svg';

const data = [
    { id: '1', title: 'All', taskAmount: 130, isShared: false, isFavorite: false, listIcon: (<ListIcon />) },
    { id: '2', title: 'Wishlist', taskAmount: 10, isShared: false, isFavorite: true },
    { id: '3', title: 'Home', taskAmount: 13, isShared: true, isFavorite: false },
    { id: '4', title: 'Shopping', taskAmount: 20, isShared: true, isFavorite: true, listIcon: (<ShoppingCart />) },
    { id: '5', title: 'Rzeczy do wzięcia do holandii', taskAmount: 5, isShared: false, isFavorite: false },
];

export default function ListList() {
    const [list, setList] = useState(data);
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
                        />
                    </View>
                )}
                numColumns={numColumns}
            />
        </View>
    )
}

const styles = StyleSheet.create({})