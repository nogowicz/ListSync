import { StyleSheet, Text, View, Animated, Keyboard, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { RootStackParamList } from 'navigation/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { buttonTypes } from 'components/button';

//components:
import CustomTextField from 'components/custom-text-field';


//icons:
import EmailIcon from 'assets/button-icons/email.svg';
import PasswordIcon from 'assets/button-icons/password.svg';
import Button from 'components/button/Button';
import Logo from 'components/logo';

//TODO:
// - fields validation


type SignInScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SIGN_IN_SCREEN'>;

type SignInScreenProps = {
    navigation: SignInScreenNavigationProp['navigation'];
};

export default function SignInScreen({ navigation }: SignInScreenProps) {
    const theme = useContext(ThemeContext);
    const intl = useIntl();

    const emailTranslation = intl.formatMessage({
        id: 'views.unauthenticated.welcome-screen.sign-in.email',
        defaultMessage: 'Email',
    });
    const passwordTranslation = intl.formatMessage({
        id: 'views.unauthenticated.welcome-screen.sign-in.password',
        defaultMessage: 'Password',
    });
    const signInTranslation = intl.formatMessage({
        id: 'views.unauthenticated.welcome-screen.sign-in.sign-in',
        defaultMessage: 'Sign In',
    });


    const translateYValue = useRef(new Animated.Value(0)).current;
    const [textContainerHeight, setTextContainerHeight] = useState(new Animated.Value(120));


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
        Animated.parallel([
            Animated.timing(translateYValue, {
                toValue: -20,
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
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <Animated.View style={[
                styles.container,
                { transform: [{ translateY: translateYValue }] }
            ]}>
                <Logo />
                <View
                    style={styles.textFieldsContainer}
                >
                    <CustomTextField
                        name={emailTranslation}
                        placeholder='johndoe@listsync.com'
                        icon={<EmailIcon />}
                        inputMode='email'
                    />

                    <CustomTextField
                        name={passwordTranslation}
                        placeholder='**********'
                        icon={<PasswordIcon />}
                        inputMode='text'
                        secureTextEntry={true}
                        isPasswordField={true}
                    />
                </View>
                <Animated.View style={[
                    styles.textContainer,
                    { height: textContainerHeight }
                ]}>
                    <Text
                        style={[{
                            color: theme.TEXT,
                        },
                        styles.subTitleText,
                        ]}
                    >
                        <FormattedMessage
                            id='views.unauthenticated.welcome-screen.sign-in.text'
                            defaultMessage="Welcome back to ListSync! Enter your credentials to seamlessly dive back into your task lists and stay organized. Let's make your task management experience even better!"
                        />
                    </Text>
                </Animated.View>
                <View
                    style={{
                        marginTop: spacing.SCALE_20,
                    }}
                >
                    <Button
                        text={signInTranslation}
                        onPress={() => console.log('signing in...')}
                        type={buttonTypes.BUTTON_TYPES.SUBMIT}
                    />
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        onPress={() => console.log("Terms and conditions")}
                    >
                        <Text
                            style={[
                                {
                                    color: theme.TEXT,
                                    fontSize: typography.FONT_SIZE_12,
                                    textAlign: 'center',
                                    marginTop: spacing.SCALE_12,
                                }
                            ]}
                        >
                            <FormattedMessage
                                id='views.unauthenticated.welcome-screen.sign-in.term_and_conditions.partI'
                                defaultMessage=" By clicking 'Sign In,' you agree to our"
                            />

                            <Text
                                style={[
                                    {
                                        color: theme.PRIMARY,
                                    }
                                ]}>
                                <FormattedMessage
                                    id='views.unauthenticated.welcome-screen.sign-in.term_and_conditions.partII'
                                    defaultMessage=" terms and conditions."
                                />
                                .
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
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
    textFieldsContainer: {

    },
    subTitleText: {
        fontSize: typography.FONT_SIZE_16,
        textAlign: 'center',
        paddingHorizontal: spacing.SCALE_20,
    },
    textContainer: {
        overflow: 'hidden',
    },
})