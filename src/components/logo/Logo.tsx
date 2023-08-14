import { Animated, Keyboard, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import { spacing, typography } from 'styles'
import { ThemeContext } from 'navigation/utils/ThemeProvider'

//icons:
import LogoIcon from 'assets/logo/logo.svg';

export default function Logo() {
    const theme = useContext(ThemeContext);

    const scaleValue = useRef(new Animated.Value(1)).current;

    const animationDuration = 400;
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
                toValue: 0.8,
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