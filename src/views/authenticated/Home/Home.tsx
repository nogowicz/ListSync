import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { ThemeContext } from '../../../navigation/utils/ThemeProvider';

export default function Home() {
    const theme = useContext(ThemeContext);
    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <Text>LLSLsl</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
})