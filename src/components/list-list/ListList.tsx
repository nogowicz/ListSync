import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ListItem from 'components/list-item'
import { numColumns } from 'components/list-item/ListItem'


type ListListProps = {
    list: any;
};

export default function ListList({ list }: ListListProps) {

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