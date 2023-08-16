import { Animated, Keyboard, StyleSheet, Text } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { spacing, typography } from 'styles'
import { useTheme } from 'navigation/utils/ThemeProvider';

//icons:
import LogoIcon from 'assets/logo/logo.svg';

type LogoProps = {
    animationDuration: number;
};

export default function Logo({
    animationDuration
}: LogoProps) {
    const theme = useTheme();

    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                handleKeyboardOut();
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                handleKeyboardIn();
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const handleKeyboardIn = () => {
        Animated.parallel([
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: animationDuration,
                useNativeDriver: true,
            }),

        ]).start();
    };

    const handleKeyboardOut = () => {
        Animated.parallel([
            Animated.timing(scaleValue, {
                toValue: 0.7,
                duration: animationDuration,
                useNativeDriver: true,
            }),

        ]).start();
    };

    return (
        <Animated.View style={[
            styles.logoContainer,
            { transform: [{ scale: scaleValue }] }
        ]}>
            <LogoIcon />
            <Text
                style={[styles.logoText, { color: theme.TEXT }]}
            >
                ListSync
            </Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        gap: spacing.SCALE_12,
    },
    logoText: {
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
})