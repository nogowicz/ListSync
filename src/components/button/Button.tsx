import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { ReactNode, cloneElement } from 'react'
import { useTheme } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';
import { buttonTypes } from '.';
import { FormattedMessage } from 'react-intl';

//icons:
import Plus from 'assets/button-icons/plus.svg';
import Check from 'assets/button-icons/Check.svg';
import HideArrow from 'assets/button-icons/Back.svg';
import GoogleSignInIcon from 'assets/button-icons/google-icon.svg';
import SignInIcon from 'assets/button-icons/login-in-icon.svg';
import PasswordVisibleIcon from 'assets/button-icons/visible-password.svg';
import PasswordInvisibleIcon from 'assets/button-icons/invisible-password.svg';
import GoBack from 'assets/button-icons/Back.svg';

export const backButtonWidth = 46.90909194946289;

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

    if (type === buttonTypes.BUTTON_TYPES.ADD) {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={[styles.addContainer, { backgroundColor: theme.ADD_BUTTON_BACKGROUND }]}
                activeOpacity={activeOpacity}
            >
                <Plus stroke={theme.ADD_BUTTON_TEXT} width={spacing.SCALE_30} height={spacing.SCALE_30} />
                <Text style={[styles.addText, { color: theme.ADD_BUTTON_TEXT }]}>{text}</Text>
            </TouchableOpacity>
        );

    } else if (type === buttonTypes.BUTTON_TYPES.FILTER) {
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
    } else if (type === buttonTypes.BUTTON_TYPES.FAB) {
        return (
            <TouchableOpacity
                activeOpacity={activeOpacity}
                style={[styles.fabContainer, { backgroundColor: theme.ADD_BUTTON_BACKGROUND }]}
                onPress={onPress}>
                <Plus stroke={theme.ADD_BUTTON_TEXT} width={spacing.SCALE_40} height={spacing.SCALE_40} />
            </TouchableOpacity>
        );
    } else if (type === buttonTypes.BUTTON_TYPES.CHECK) {
        return (
            <TouchableOpacity
                activeOpacity={activeOpacity}
                style={[
                    styles.checkButton,
                    isChecked && {
                        backgroundColor: theme.PRIMARY,
                    },
                    {
                        borderWidth: constants.BORDER_WIDTH.CHECK,
                        borderColor: theme.PRIMARY,
                    }]}
                onPress={onPress}>
                {isChecked ?
                    <Check
                        stroke={theme.WHITE}
                        strokeWidth={constants.STROKE_WIDTH.ICON}
                        width={constants.ICON_SIZE.CHECK}
                        height={constants.ICON_SIZE.CHECK}
                    /> :
                    <View
                        style={{
                            width: constants.ICON_SIZE.CHECK,
                            height: constants.ICON_SIZE.CHECK
                        }} />
                }
            </TouchableOpacity>
        );
    } else if (type === buttonTypes.BUTTON_TYPES.FUNCTIONAL) {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={[styles.functionalContainer, { backgroundColor: theme.SECONDARY }]}
                activeOpacity={activeOpacity}
            >
                <Text style={[styles.addText, { color: theme.PRIMARY }]}>{text}</Text>
            </TouchableOpacity>
        );
    } else if (type === buttonTypes.BUTTON_TYPES.HIDE_INPUT) {
        return (
            <TouchableOpacity
                activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                style={styles.hideArrow}
                onPress={onPress}
            >
                <HideArrow
                    fill={theme.HINT}
                    strokeWidth={constants.STROKE_WIDTH.ICON}
                    width={15}
                />
            </TouchableOpacity>
        );
    } else if (type === buttonTypes.BUTTON_TYPES.GOOGLE_SIGN_IN) {
        return (
            <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={onPress}
                style={[
                    styles.googleButton,
                    {
                        backgroundColor: theme.FIXED_PRIMARY_BLUE
                    }
                ]}
            >
                <GoogleSignInIcon />
                <Text
                    style={[
                        styles.googleButtonText,
                    ]}
                >
                    <FormattedMessage
                        id='views.unauthenticated.welcome-screen.google-sign-in'
                        defaultMessage='Sign in with Google account'
                    />
                </Text>
            </TouchableOpacity>
        );
    } else if (type === buttonTypes.BUTTON_TYPES.SIGN_IN) {
        return (
            <TouchableOpacity
                activeOpacity={activeOpacity}
                style={[
                    styles.signInButton,
                    {
                        backgroundColor: theme.SECONDARY
                    }
                ]}
                onPress={onPress}
            >
                <SignInIcon
                    fill={theme.TEXT}
                />
                <Text
                    style={[
                        styles.signInButtonText,
                        { color: theme.TEXT }
                    ]}
                >
                    <FormattedMessage
                        id='views.unauthenticated.welcome-screen.sign-in'
                        defaultMessage='Sign in with email'
                    />
                </Text>
            </TouchableOpacity>
        );
    } else if (type === buttonTypes.BUTTON_TYPES.PASSWORD_VISIBILITY) {
        return (
            <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={onPress}
            >
                {secureTextEntry ?
                    <PasswordInvisibleIcon
                        stroke={theme.TEXT}
                        strokeWidth={constants.STROKE_WIDTH.ICON}
                    /> :
                    <PasswordVisibleIcon
                        stroke={theme.TEXT}
                        strokeWidth={constants.STROKE_WIDTH.ICON}
                    />
                }
            </TouchableOpacity>
        );
    } else if (type === buttonTypes.BUTTON_TYPES.SUBMIT) {
        return (
            <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={onPress}
                style={[
                    {
                        backgroundColor: theme.PRIMARY,
                    },
                    styles.submitButton,
                ]}
            >
                <Text
                    style={[
                        {
                            color: 'white'
                        },
                        styles.submitButtonText
                    ]}
                >
                    {text}
                </Text>
            </TouchableOpacity>
        );
    } else if (type === buttonTypes.BUTTON_TYPES.BACK) {
        return (
            <TouchableOpacity
                activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                style={[styles.backButton, { borderColor: theme.LIGHT_HINT, }]}
                onPress={onPress}
            >
                <GoBack
                    fill={theme.TEXT}
                />
            </TouchableOpacity>
        );
    } else if (type === buttonTypes.BUTTON_TYPES.SETTING) {
        return (
            <TouchableOpacity
                activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                style={[styles.settingButton, { borderColor: theme.HINT }]}
                onPress={onPress}
            >

                {icon && cloneElement(icon as JSX.Element,
                    {
                        strokeWidth: constants.STROKE_WIDTH.ICON,
                        width: constants.ICON_SIZE.SETTING_BUTTON,
                        height: constants.ICON_SIZE.SETTING_BUTTON,
                        stroke: color ? color : theme.TEXT
                    })}
                <Text
                    style={[
                        {
                            color: color ? color : theme.TEXT
                        },
                        styles.settingsButtonText
                    ]}
                >
                    {text}
                </Text>
            </TouchableOpacity>
        );

    }


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