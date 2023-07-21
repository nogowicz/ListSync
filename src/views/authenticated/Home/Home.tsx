import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { ThemeContext } from '../../../navigation/utils/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';


import TopPanel from 'components/top-panel';
import { spacing } from 'styles';

type HomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'HOME'>;

type HomeProps = {
    navigation: HomeScreenNavigationProp['navigation']
}

export default function Home({ navigation }: HomeProps) {
    const theme = useContext(ThemeContext);
    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <TopPanel
                name='John'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_20,
        paddingVertical: spacing.SCALE_20,
    },
})