import React, { useContext } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { ThemeContext } from '../../../navigation/utils/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';

import TopPanel from 'components/top-panel';
import { spacing } from 'styles';
import FilterPanel from 'components/filter-panel';
import ListItem from 'components/list-item';
import { numColumns } from 'components/list-item/ListItem';

type HomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'HOME'>;

type HomeProps = {
    navigation: HomeScreenNavigationProp['navigation'];
};

const data = [
    { id: '1', title: 'All', taskAmount: 130, isShared: false, isFavorite: false },
    { id: '2', title: 'Wishlist', taskAmount: 10, isShared: false, isFavorite: true },
    { id: '3', title: 'Home', taskAmount: 13, isShared: true, isFavorite: false },
    { id: '4', title: 'Shopping', taskAmount: 20, isShared: true, isFavorite: true },
    { id: '5', title: 'Primark', taskAmount: 5, isShared: false, isFavorite: false },
    { id: '6', title: 'Primark', taskAmount: 5, isShared: false, isFavorite: false },
    { id: '7', title: 'Primark', taskAmount: 5, isShared: false, isFavorite: false },
    { id: '8', title: 'Primark', taskAmount: 5, isShared: false, isFavorite: false },
    { id: '9', title: 'Primark', taskAmount: 5, isShared: false, isFavorite: false },
];

const screenWidth = Dimensions.get('window').width;

export default function Home({ navigation }: HomeProps) {
    const theme = useContext(ThemeContext);

    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <TopPanel name='John' />
                <FilterPanel />
                <View style={{ flex: 1, }}>
                    <FlatList
                        data={data}
                        keyExtractor={(item: any) => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }: any) => (
                            <View>
                                <ListItem
                                    listName={item.title}
                                    taskAmount={item.taskAmount}
                                    isShared={item.isShared}
                                    isFavorite={item.isFavorite}
                                />
                            </View>
                        )}
                        numColumns={numColumns}
                    />
                </View>
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
