import React, { useContext } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { ThemeContext } from '../../../navigation/utils/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';

import TopPanel from 'components/top-panel';
import { spacing } from 'styles';
import FilterPanel from 'components/filter-panel';
import ListList from 'components/list-list';

type HomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'HOME'>;

type HomeProps = {
    navigation: HomeScreenNavigationProp['navigation'];
};




export default function Home({ navigation }: HomeProps) {
    const theme = useContext(ThemeContext);

    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <TopPanel name='John' />
                <FilterPanel />
                <ListList />
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
