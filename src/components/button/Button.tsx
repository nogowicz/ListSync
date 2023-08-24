import { StyleSheet, } from 'react-native'
import React, { ReactNode } from 'react'
import { useTheme } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';
import { buttonTypes } from '.';
import { prepareButtons } from './helpers';

export const backButtonWidth = 46.90909194946289;

type ButtonElement = {
    type: buttonTypes.BUTTON_TYPES;
    button?: JSX.Element;
    buttonTypes?: JSX.Element;
};


type ButtonProps = {
    text?: string | ReactNode;
    type: buttonTypes.BUTTON_TYPES;
    amount?: number;
    isActive?: boolean;
    onPress: () => void;
    isChecked?: boolean;
    color?: string;
    activeOpacity?: number;
    secureTextEntry?: boolean;
    icon?: JSX.Element;
};

export default function Button({
    text,
    type,
    amount,
    onPress,
    isChecked,
    color,
    isActive = false,
    activeOpacity = constants.ACTIVE_OPACITY.HIGH,
    secureTextEntry = false,
    icon,
}: ButtonProps) {
    const theme = useTheme();

    const buttonElement = prepareButtons({
        onPress: onPress,
        text: text,
        activeOpacity: activeOpacity,
        amount: amount,
        isActive: isActive,
        color: color,
        isChecked: isChecked,
        secureTextEntry: secureTextEntry,
        icon: icon,
    });

    function getButtonById(buttonElements: ButtonElement[], type: buttonTypes.BUTTON_TYPES) {
        return buttonElements.find(button => button.type === type);
    }



    const button: ButtonElement = getButtonById(buttonElement, type) as ButtonElement;


    return (
        <>
            {button && button.button}
        </>
    );
}

const styles = StyleSheet.create({
    addContainer: {
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
    },
    checkButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.SCALE_4,
        borderRadius: constants.BORDER_RADIUS.CHECK_BUTTON,
        marginRight: spacing.SCALE_12,
    },
    functionalContainer: {
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: spacing.SCALE_8,
        paddingHorizontal: spacing.SCALE_12,
    },
    hideArrow: {
        transform: [{ rotate: '-90deg' }],
        paddingHorizontal: spacing.SCALE_12,
        paddingVertical: spacing.SCALE_8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.SCALE_6,
        marginRight: -spacing.SCALE_12,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.SCALE_12,
        paddingHorizontal: spacing.SCALE_30,
        gap: spacing.SCALE_20,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
    },
    googleButtonText: {
        color: 'white',
        fontSize: typography.FONT_SIZE_16,
    },
    signInButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.SCALE_12,
        paddingHorizontal: spacing.SCALE_30,
        gap: spacing.SCALE_20,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
    },
    signInButtonText: {
        fontSize: typography.FONT_SIZE_16,
    },
    submitButton: {
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.SCALE_12,
    },
    submitButtonText: {
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_20,
    },
    backButton: {
        borderWidth: constants.BORDER_WIDTH.BACK,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        padding: spacing.SCALE_12,
    },
    settingButton: {
        borderTopWidth: constants.BORDER_WIDTH.BACK,
        paddingVertical: spacing.SCALE_10,
        paddingHorizontal: spacing.SCALE_10,
        flexDirection: 'row',
        gap: spacing.SCALE_10,
        alignItems: 'center',
    },
    settingsButtonText: {
        fontSize: spacing.SCALE_20,
    },

});