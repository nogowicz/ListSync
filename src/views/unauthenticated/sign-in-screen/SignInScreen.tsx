import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { RootStackParamList } from 'navigation/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import { spacing, typography } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';

//components:
import CustomTextField from 'components/custom-text-field';


//icons:
import LogoIcon from 'assets/logo/logo.svg';
import EmailIcon from 'assets/button-icons/email.svg';
import PasswordIcon from 'assets/button-icons/password.svg';

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

    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <LogoIcon />
                    <Text
                        style={[styles.logoText, { color: theme.TEXT }]}
                    >
                        ListSync
                    </Text>
                </View>
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
    logoContainer: {
        alignItems: 'center',
        gap: spacing.SCALE_12,
    },
    logoText: {
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    textFieldsContainer: {

    },
    subTitleText: {
        fontSize: typography.FONT_SIZE_16,
        textAlign: 'center',
        paddingHorizontal: spacing.SCALE_20,
    },
})