import { useEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl";
import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Animated, Keyboard, View } from "react-native";
import { SignUpScreenNavigationProp } from "./SignUpScreen";
import { schema } from "./signUpValidation";
import { backButtonWidth } from "components/button/Button";
import { useTheme } from "navigation/utils/ThemeProvider";
import { useAuth } from "context/AuthContext";

//components:
import Button, { buttonTypes } from "components/button";
import Logo from "components/logo";
import CustomTextField from "components/custom-text-field";

//icons:
import EmailIcon from 'assets/button-icons/email.svg';
import PasswordIcon from 'assets/button-icons/password.svg';
import PersonIcon from 'assets/button-icons/person-icon.svg';

//TODO:
//Error handling

type PrepareSignUpPagesType = {
    navigation: SignUpScreenNavigationProp['navigation'];
    handleBack: Function;
    handleNextPage: Function;
    handlePageWithError: Function;
    animationDuration: number;
}

export function prepareSignUpPages({
    navigation,
    handleBack,
    handleNextPage,
    handlePageWithError,
    animationDuration,
}: PrepareSignUpPagesType) {
    const [loading, setLoading] = useState(false);
    const intl = useIntl();
    const theme = useTheme();
    const { register, login } = useAuth();
    const { control, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });


    const onSubmit: SubmitHandler<FieldValues> = async ({ firstName, lastName, email, photoURL = null, password, confirmPassword }) => {
        setLoading(true);
        try {
            await register(email, password, firstName, lastName);
        } catch (error: any) {
            handlePageWithError(0);
            setError('email', { message: error.message || 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };


    if (errors) {
        useEffect(() => {
            if (errors.email || errors.password || errors.confirmPassword) {
                handlePageWithError(0);
            } else if (errors.firstName || errors.lastName) {
                handlePageWithError(1);
            }
        }, [errors]);
    }


    //translations:
    const emailTranslation = intl.formatMessage({
        id: 'views.unauthenticated.welcome-screen.sign-up.email',
        defaultMessage: 'Email',
    });
    const passwordTranslation = intl.formatMessage({
        id: 'views.unauthenticated.welcome-screen.sign-up.password',
        defaultMessage: 'Password',
    });
    const confirmPasswordTranslation = intl.formatMessage({
        id: 'views.unauthenticated.welcome-screen.sign-up.confirm-password',
        defaultMessage: 'Confirm password',
    });
    const continueTranslation = intl.formatMessage({
        id: 'views.unauthenticated.welcome-screen.sign-up.continue',
        defaultMessage: 'Continue',
    });
    const firstNameTranslation = intl.formatMessage({
        id: 'views.unauthenticated.welcome-screen.sign-up.first-name',
        defaultMessage: 'First name',
    });
    const lastNameTranslation = intl.formatMessage({
        id: 'views.unauthenticated.welcome-screen.sign-up.last-name',
        defaultMessage: 'Last name',
    });
    const signUpTranslation = intl.formatMessage({
        id: 'views.unauthenticated.welcome-screen.sign-up.sign-up',
        defaultMessage: 'Sign Up',
    });
    const loadingTranslation = intl.formatMessage({
        id: 'views.unauthenticated.button.loading',
        defaultMessage: 'Loading...'
    });

    const translateYValue = useRef(new Animated.Value(0)).current;


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
        ]).start();
    };

    const handleKeyboardOut = () => {
        Animated.parallel([
            Animated.timing(translateYValue, {
                toValue: -30,
                duration: animationDuration,
                useNativeDriver: true,
            }),
        ]).start();
    };


    return [
        {
            id: 'credentials',
            topContainer: (
                <>
                    <Button
                        onPress={() => navigation.goBack()}
                        type={buttonTypes.BUTTON_TYPES.BACK}
                    />
                    <Animated.View style={[{ transform: [{ translateY: translateYValue }] }]}>
                        <Logo
                            animationDuration={animationDuration}
                        />
                    </Animated.View>
                    <View
                        style={{
                            width: backButtonWidth
                        }}
                    >
                    </View>
                </>
            ),

            subTitle: (
                <FormattedMessage
                    id="views.unauthenticated.signUp.subtitle.credentials"
                    defaultMessage="Give us your email and password, and you'll have access to your tasks anytime, anywhere."
                />
            ),
            mainContent: (
                <>
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
                                />)
                        }
                        }
                    />

                    <Controller
                        name='confirmPassword'
                        rules={{
                            required: true,
                        }}
                        defaultValue=''
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <CustomTextField
                                    name={confirmPasswordTranslation}
                                    placeholder='**********'
                                    icon={<PasswordIcon />}
                                    inputMode='text'
                                    secureTextEntry={true}
                                    isPasswordField={true}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.confirmPassword}
                                    value={value}
                                />)
                        }
                        }
                    />
                </>
            ),
            buttonLabel: continueTranslation,
            buttonAction: handleNextPage


        },
        {
            id: 'names',
            topContainer: (
                <>
                    <Button
                        onPress={() => handleBack()}
                        type={buttonTypes.BUTTON_TYPES.BACK}
                    />
                    <Animated.View style={[{ transform: [{ translateY: translateYValue }] }]}>
                        <Logo
                            animationDuration={animationDuration}
                        />
                    </Animated.View>
                    <View
                        style={{
                            width: backButtonWidth
                        }}
                    >
                    </View>
                </>
            ),
            subTitle: (
                <FormattedMessage
                    id="views.unauthenticated.signUp.subtitle.names"
                    defaultMessage="Please provide us with your information so we can personalize your experience."
                />
            ),
            mainContent: (
                <View>
                    <Controller
                        name='firstName'
                        rules={{
                            required: true,
                        }}
                        defaultValue=''
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <CustomTextField
                                    name={firstNameTranslation}
                                    placeholder='John'
                                    icon={<PersonIcon
                                        stroke={theme.TEXT}
                                    />}
                                    inputMode='text'
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.firstName}
                                    value={value}
                                />)
                        }
                        }
                    />
                    <Controller
                        name='lastName'
                        rules={{
                            required: true,
                        }}
                        defaultValue=''
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <CustomTextField
                                    name={lastNameTranslation}
                                    placeholder='Doe'
                                    icon={<PersonIcon
                                        stroke={theme.TEXT}
                                    />}
                                    inputMode='text'
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.lastName}
                                    value={value}
                                />)
                        }
                        }
                    />
                </View>
            ),
            buttonLabel: (loading ? loadingTranslation : signUpTranslation),
            buttonAction: handleSubmit(onSubmit)
        },
    ];
}