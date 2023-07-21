import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import { colors, constants, spacing, typography } from 'styles';

import Plus from 'assets/button-icons/plus.svg';

type ButtonProps = {
    text: string;
    type: "add" | "submit";
    activeOpacity?: number;
};

export default function Button({ text, type, activeOpacity = 0.7 }: ButtonProps) {
    const theme = useContext(ThemeContext);
    if (type === "add") {
        return (
            <TouchableOpacity
                style={[styles.container, { backgroundColor: theme.TERTIARY }]}
                activeOpacity={activeOpacity}
            >
                <Plus stroke={theme.PRIMARY} width={spacing.SCALE_30} height={spacing.SCALE_30} />
                <Text style={[styles.addText, { color: theme.PRIMARY }]}>{text}</Text>
            </TouchableOpacity>
        );

    } else {
        return (
            <View style={[styles.container, { backgroundColor: theme.TERTIARY }]}>
                <Text>{text}</Text>
            </View>
        );

    }


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "blue",
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: spacing.SCALE_4,
        paddingHorizontal: spacing.SCALE_12,
    },
    addText: {
        fontSize: typography.FONT_SIZE_18,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
    }
})