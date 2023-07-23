import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, FlatList, Keyboard, StyleSheet, View } from 'react-native';
import { ThemeContext } from '../../../navigation/utils/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';

import TopPanel from 'components/top-panel';
import { spacing } from 'styles';
import FilterPanel from 'components/filter-panel';
import ListList from 'components/list-list';
import Button from 'components/button';


import ShoppingCart from 'assets/list-icons/shopping-cart.svg';
import ListIcon from 'assets/list-icons/list-icon.svg';
import AddTaskField from 'components/add-task-field';

const data = [
    { id: '1', title: 'All', taskAmount: 130, isShared: false, isFavorite: false, isArchived: false, listIcon: (<ListIcon />) },
    { id: '2', title: 'Wishlist', taskAmount: 10, isShared: false, isFavorite: true, isArchived: false, },
    { id: '3', title: 'Home', taskAmount: 13, isShared: true, isFavorite: false, isArchived: false, },
    { id: '4', title: 'Shopping', taskAmount: 20, isShared: true, isFavorite: true, isArchived: false, listIcon: (<ShoppingCart />) },
    { id: '5', title: 'Stuff to take on the trip', taskAmount: 5, isShared: false, isArchived: true, isFavorite: false },
];

type HomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'HOME'>;

type HomeProps = {
    navigation: HomeScreenNavigationProp['navigation'];
};


export default function Home({ navigation }: HomeProps) {
    const theme = useContext(ThemeContext);
    const newList = data.filter((item: any) => item.isArchived === false);
    const [list, setList] = useState(newList);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <TopPanel name='John' />
                <FilterPanel data={data} setList={setList} />
                <ListList list={list} />
                {isKeyboardVisible ? <AddTaskField /> :
                    <Button type='fab' onPress={() => setKeyboardVisible(true)} />}

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
