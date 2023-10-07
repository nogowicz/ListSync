import { StyleSheet, Text, View, Animated, Keyboard, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { RootStackParamList } from 'navigation/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { buttonTypes } from 'components/button';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './signInVallidationSchema';

//components:
import CustomTextField from 'components/custom-text-field';
import Button, { backButtonWidth } from 'components/button/Button';
import Logo from 'components/logo';


//icons:
import EmailIcon from 'assets/button-icons/email.svg';
import PasswordIcon from 'assets/button-icons/password.svg';
import { useAuth } from 'context/AuthContext';

type SignInScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SIGN_IN_SCREEN'>;

type SignInScreenProps = {
    navigation: SignInScreenNavigationProp['navigation'];
};

export default function SignInScreen({ navigation }: SignInScreenProps) {
    const theme = useTheme();
    const intl = useIntl();
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();


    //form handlers:
    const { control, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema(intl))
    });

    const onSubmit: SubmitHandler<FieldValues> = async ({ email, password }) => {
        setLoading(true);

        try {
            await login(email, password).then(() => {
                setLoading(false);
            })
        } catch (error: any) {
            setError('email', { message: error.message });
            setLoading(false);
        }
    }

    //translations:
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
    const loadingTranslation = intl.formatMessage({
        id: 'views.unauthenticated.button.loading',
        defaultMessage: 'Loading...'
    });
    const forgotPasswordTranslation = intl.formatMessage({
        id: 'views.unauthenticated.welcome-screen.sign-in.forgot-password',
        defaultMessage: 'Forgot Password?',
    });


    //animations:
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
                toValue: -30,
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
            <View style={[
                styles.container
            ]}>
                <View style={styles.topContainer}>
                    <Button
                        onPress={() => navigation.goBack()}
                        type={buttonTypes.BUTTON_TYPES.BACK}
                    />
                    <Animated.View style={{ transform: [{ translateY: translateYValue }] }}>
                        <Logo
                            animationDuration={animationDuration}
                        />
                    </Animated.View>
                    <View
                        style={{
                            width: backButtonWidth
                        }}
                    />
                </View>

                <Animated.View
                    style={[styles.textFieldsContainer,
                    { transform: [{ translateY: translateYValue }] }
                    ]}
                >
                    <Controller
                        name='email'
                        rules={{
                            required: true,
                        }}
                        defaultValue=''
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => {
                            const placeholder = "johndoe@listsync.com";
                            return (
                                <CustomTextField
                                    name={emailTranslation}
                                    placeholder={placeholder}
                                    icon={<EmailIcon />}
                                    inputMode='email'
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.email}
                                    value={value}

                                />)
                        }
                        }
                    />

                    <Controller
                        name='password'
                        rules={{
                            required: true,
                        }}
                        defaultValue=''
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <CustomTextField
                                    name={passwordTranslation}
                                    placeholder='**********'
                                    icon={<PasswordIcon />}
                                    inputMode='text'
                                    secureTextEntry={true}
                                    isPasswordField={true}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.password}
                                    value={value}
                                    actionLabel={forgotPasswordTranslation}
                                    action={() => {
                                        console.log("Navigating to forgot password screen")
                                        // navigation.navigate(SCREENS.AUTHENTICATED.FORGOT_PASSWORD.ID)
                                    }}
                                />)
                        }
                        }
                    />
                </Animated.View>
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
                        marginTop: spacing.SCALE_8,
                    }}
                >
                    <Button
                        text={loading ? loadingTranslation : signInTranslation}
                        onPress={handleSubmit(onSubmit)}
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
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    }
});