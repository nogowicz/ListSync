import { Animated, Keyboard, StyleSheet, Text, View } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useTheme } from 'navigation/utils/ThemeProvider'
import { typography, spacing } from 'styles';
import { SignUpPagesArrayType } from '../SignUpScreen';
import Button, { buttonTypes } from 'components/button';
import Pagination from 'components/pagination';

type SignUpPanelProps = {
    id: string;
    topContainer: JSX.Element;
    subTitle: JSX.Element;
    mainContent: JSX.Element;
    buttonLabel: string;
    buttonAction: Dispatch<SetStateAction<number>> | any;
    page: number;
    pages: SignUpPagesArrayType;
}

export default function SignUpPanel({
    id,
    topContainer,
    subTitle,
    mainContent,
    buttonLabel,
    buttonAction,
    page,
    pages
}: SignUpPanelProps) {
    const theme = useTheme();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const translateYValue = useRef(new Animated.Value(0)).current;
    const animationDuration = 200;
    const [textContainerHeight] = useState(new Animated.Value(120));

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
        setIsKeyboardVisible(false);
        Animated.parallel([
            Animated.timing(translateYValue, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
            }),
            Animated.timing(textContainerHeight, {
                toValue: 120,
                duration: animationDuration,
                useNativeDriver: false,
            })
        ]).start();
    };

    const handleKeyboardOut = () => {
        setIsKeyboardVisible(true);
        Animated.parallel([
            Animated.timing(translateYValue, {
                toValue: -40,
                duration: animationDuration,
                useNativeDriver: true,
            }),
            Animated.timing(textContainerHeight, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: false,
            })
        ]).start();
    };

    return (
        <View style={styles.root}>
            <View style={[styles.container]}>
                <View style={[styles.actionContainer]}>
                    {topContainer}
                </View>
                <Animated.View style={[styles.textContainer, { height: textContainerHeight }]}>
                    <Text style={[styles.subTitle, { color: theme.TEXT }]}>
                        {subTitle}
                    </Text>
                </Animated.View>
                <Animated.View style={[styles.mainContent, { transform: [{ translateY: translateYValue }] }]}>
                    {mainContent}
                </Animated.View>
                {!isKeyboardVisible &&
                    <Pagination activePage={page} pages={pages} />}
                <Animated.View style={[{ marginTop: spacing.SCALE_10 }, { transform: [{ translateY: translateYValue }] }]}>
                    <Button
                        text={buttonLabel}
                        onPress={buttonAction}
                        type={buttonTypes.BUTTON_TYPES.SUBMIT}
                    />
                </Animated.View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        marginHorizontal: spacing.SCALE_20,
        marginVertical: spacing.SCALE_20,
        flex: 1,
        justifyContent: 'space-between',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    textContainer: {
        marginTop: -spacing.SCALE_20,
        justifyContent: 'center',
    },
    subTitle: {
        ...typography.FONT_REGULAR,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        fontSize: typography.FONT_SIZE_15,
        textAlign: 'center',
    },
    mainContent: {
        marginBottom: spacing.SCALE_4,
    }
})