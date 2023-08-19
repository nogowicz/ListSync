import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

import { FormattedMessage, useIntl } from "react-intl";
import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Animated, Keyboard, View } from "react-native";
import { spacing } from "styles";
import { SignUpScreenNavigationProp } from "./SignUpScreen";
import { useNavigation, useTheme } from "@react-navigation/native";
import { schema } from "./signUpValidation";
import Button, { buttonTypes } from "components/button";
import Logo from "components/logo";
import { backButtonWidth } from "components/button/Button";
import CustomTextField from "components/custom-text-field";

//icons:
import EmailIcon from 'assets/button-icons/email.svg';
import PasswordIcon from 'assets/button-icons/password.svg';

type PrepareSignUpPagesType = {
    navigation: SignUpScreenNavigationProp['navigation'];
    handleBack: Dispatch<SetStateAction<number>>;
    handleNextPage: Dispatch<SetStateAction<number>>;
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
    const { control, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const theme = useTheme();

    const onSubmit: SubmitHandler<FieldValues> = async ({ firstName, lastName, email, password, confirmPassword }) => {
        setLoading(true);
        try {
            setLoading(false);
        } catch (error: any) {
            console.log(error)

            handlePageWithError(0);

            setLoading(false)
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
    const signInTranslation = intl.formatMessage({
        id: 'views.unauthenticated.welcome-screen.sign-up.sign-up',
        defaultMessage: 'Sign Un',
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

            subTitle: (<></>),
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
            buttonLabel: 'Continue',
            buttonAction: handleNextPage


        },
        // {
        //     id: 'names',
        //     action: (

        //     ),
        //     logo: (

        //     ),
        //     title: (

        //     ),
        //     subTitle: (

        //     ),
        //     mainContent: (

        //     ),
        //     buttonLabel: (
        //         <FormattedMessage
        //             defaultMessage='Continue'
        //             id='views.auth.signup.submit-button-continue'
        //         />
        //     ),
        //     buttonAction: handleNextPage


        // },
        // {
        //     id: 'profile-photo',
        //     action: (

        //     ),
        //     logo: (

        //     ),
        //     title: (

        //     ),
        //     subTitle: (

        //     ),
        //     mainContent: (

        //     ),
        //     buttonLabel: (

        //     ),
        //     buttonAction: handleSubmit(onSubmit)

        // },
    ];
}