import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider';

type ButtonProps = {
    text: string;
    type: "add";
};

export default function Button({ text, type }: ButtonProps) {
    const theme = useContext(ThemeContext);
    return (
        <View style={[styles.container, { backgroundColor: theme.TERTIARY }]}>
            <Text>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "blue",
    }
})