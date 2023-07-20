import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';

type ListScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'LIST'>;

type ListProps = {
    navigation: ListScreenNavigationProp['navigation']
}


export default function List({ navigation }: ListProps) {
    return (
        <View>
            <Text>List</Text>
        </View>
    )
}

const styles = StyleSheet.create({})