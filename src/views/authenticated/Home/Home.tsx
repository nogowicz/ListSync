import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, FlatList, Keyboard, StyleSheet, View } from 'react-native';
import { ThemeContext } from '../../../navigation/utils/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';

import TopPanel from 'components/top-panel';
import { spacing } from 'styles';
import FilterPanel from 'components/filter-panel';
import ListList from 'components/list-list';
import Button, { buttonTypes } from 'components/button';

import AddTaskField from 'components/add-task-field';
import { List } from 'data/types';
import { useListContext } from 'context/DataProvider';

type HomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'HOME'>;

type HomeProps = {
    navigation: HomeScreenNavigationProp['navigation'];
};


export default function Home({ navigation }: HomeProps) {
    const theme = useContext(ThemeContext);
    const { listData } = useListContext();
    const newList = listData.filter((item: List) => item.isArchived === false);
    const [list, setList] = useState<List[]>(newList);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const filteredList = listData.filter((item: List) => item.isArchived === false);
        setList(filteredList);
    }, [listData]);

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
                <FilterPanel setList={setList} />
                <ListList list={list} />
                {isKeyboardVisible ? <AddTaskField /> :
                    <Button type={buttonTypes.BUTTON_TYPES.FAB} onPress={() => setKeyboardVisible(true)} />}

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
