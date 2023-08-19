import { Animated, Keyboard, StyleSheet, Text, View } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { useTheme } from 'navigation/utils/ThemeProvider'
import { typography, spacing } from 'styles';
import { SignUpPagesArrayType } from '../SignUpScreen';
import Button, { buttonTypes } from 'components/button';

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

    const translateYValue = useRef(new Animated.Value(0)).current;
    const animationDuration = 200;


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
        Animated.timing(translateYValue, {
            toValue: 0,
            duration: animationDuration,
            useNativeDriver: true,
        }).start();
    };

    const handleKeyboardOut = () => {
        Animated.timing(translateYValue, {
            toValue: -80,
            duration: animationDuration,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.root}>
            <View style={[styles.container]}>
                <View style={[styles.actionContainer]}>
                    {topContainer}
                </View>
                <View style={[styles.textContainer]}>
                    <View style={styles.textContainer}>
                        <Text style={[styles.subTitle, { color: theme.TERTIARY }]}>
                            {subTitle}
                        </Text>
                    </View>
                    <Animated.View style={[styles.mainContent, { transform: [{ translateY: translateYValue }] }]}>
                        {mainContent}
                    </Animated.View>
                </View>
                {/* {isKeyboardVisible ? null :
        <Pagination activePage={page} pages={pages} />} */}
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
        justifyContent: 'center',
    },
    subTitle: {
        ...typography.FONT_REGULAR,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        fontSize: typography.FONT_SIZE_12,
        textAlign: 'center',
    },
    mainContent: {
        marginBottom: spacing.SCALE_4,
    }
})