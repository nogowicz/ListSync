import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, ReactNode } from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';

import Plus from 'assets/button-icons/plus.svg';

type ButtonProps = {
    text?: string | ReactNode;
    type: "add" | "filter" | "fab";
    amount?: number;
    isActive?: boolean;
    onPress: () => void;
    activeOpacity?: number;
};

export default function Button({ text, type, amount, onPress, isActive = false, activeOpacity = 0.7 }: ButtonProps) {
    const theme = useContext(ThemeContext);
    if (type === "add") {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={[styles.addContainer, { backgroundColor: theme.TERTIARY }]}
                activeOpacity={activeOpacity}
            >
                <Plus stroke={theme.PRIMARY} width={spacing.SCALE_30} height={spacing.SCALE_30} />
                <Text style={[styles.addText, { color: theme.PRIMARY }]}>{text}</Text>
            </TouchableOpacity>
        );

    } else if (type === "filter") {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={activeOpacity}
                style={[styles.filterContainer]}
            >
                <Text
                    style={[
                        styles.filterText,
                        isActive ? { color: theme.PRIMARY, fontWeight: typography.FONT_WEIGHT_BOLD } :
                            { color: theme.HINT }]}
                >
                    {text}
                </Text>
                <View
                    style={[styles.amountFilterContainer,
                    isActive ? { backgroundColor: theme.PRIMARY } : { backgroundColor: theme.HINT }]}
                >
                    <Text style={[
                        styles.amountFilterText,
                        { color: theme.BACKGROUND }]}
                    >{amount}</Text>
                </View>
            </TouchableOpacity>
        );
    } else if (type === "fab") {
        return (
            <TouchableOpacity
                activeOpacity={activeOpacity}
                style={[styles.fabContainer, { backgroundColor: theme.TERTIARY }]}
                onPress={onPress}>
                <Plus stroke={theme.PRIMARY} width={spacing.SCALE_40} height={spacing.SCALE_40} />
            </TouchableOpacity>
        );
    } else {
        return (
            <View style={[styles.filterContainer, { backgroundColor: theme.TERTIARY }]}>
                <Text>{text}</Text>
            </View>
        );

    }


}

const styles = StyleSheet.create({
    addContainer: {
        backgroundColor: "blue",
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: spacing.SCALE_4,
        paddingRight: spacing.SCALE_12,
        paddingLeft: spacing.SCALE_4,
    },
    addText: {
        fontSize: typography.FONT_SIZE_18,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
    },
    filterContainer: {
        flexDirection: "row",
        gap: spacing.SCALE_4,
        alignItems: "center",
        marginRight: spacing.SCALE_12,
    },
    filterText: {
        fontSize: typography.FONT_SIZE_18,
    },
    amountFilterContainer: {
        paddingVertical: spacing.SCALE_2,
        paddingHorizontal: spacing.SCALE_8,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
    },
    amountFilterText: {
        fontSize: typography.FONT_SIZE_12,
    },
    fabContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        position: "absolute",
        bottom: spacing.SCALE_30,
        right: 0,
        paddingHorizontal: spacing.SCALE_12,
        paddingVertical: spacing.SCALE_12,
    }
})