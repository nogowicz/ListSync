import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { ThemeContext } from '../../../navigation/utils/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';

type HomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'HOME'>;

type HomeProps = {
    navigation: HomeScreenNavigationProp['navigation']
}

export default function Home({ navigation }: HomeProps) {
    const theme = useContext(ThemeContext);
    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <Text style={{ color: theme.TEXT }}>Home</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
})