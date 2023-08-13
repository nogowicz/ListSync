import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native'
import React, { useContext, } from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider'
import { constants, spacing, typography } from 'styles';
import { FormattedMessage } from 'react-intl';

//icons:
import WelcomeScreenIcon from 'assets/images/welcome-screen.svg';
import Button, { buttonTypes } from 'components/button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { SCREENS } from 'navigation/utils/screens';

type WelcomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'WELCOME_SCREEN'>;

type WelcomeScreenProps = {
  navigation: WelcomeScreenNavigationProp['navigation'];
};

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const theme = useContext(ThemeContext);
  return (
    <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
      <View style={styles.container}>
        <Text
          style={[{
            color: theme.TEXT,
          },
          styles.titleText,
          ]}
        >
          <FormattedMessage
            id='views.unauthenticated.welcome-screen.title'
            defaultMessage='Welcome to ListSync'
          />
        </Text>
        <WelcomeScreenIcon />
        <Text
          style={[{
            color: theme.TEXT,
          },
          styles.subTitleText,
          ]}
        >
          <FormattedMessage
            id='views.unauthenticated.welcome-screen.sub-title'
            defaultMessage='Welcome to ListSync - your new companion in task organization! ListSync helps you effortlessly manage shopping lists, tasks, and projects. Start using ListSync today!'
          />
        </Text>
        <View
          style={styles.buttonsContainer}
        >
          <Button
            type={buttonTypes.BUTTON_TYPES.GOOGLE_SIGN_IN}
            onPress={() => console.log('Sign in with google')}
          />
          <Button
            type={buttonTypes.BUTTON_TYPES.SIGN_IN}
            onPress={() => navigation.navigate(SCREENS.UNAUTHENTICATED.SING_IN_SCREEN.ID)}
          />
        </View>
        <TouchableOpacity
          style={{
            alignItems: 'center',
          }}
          onPress={() => console.log('Sign up')}
          activeOpacity={constants.ACTIVE_OPACITY.HIGH}
        >
          <Text
            style={
              styles.signUpButtonText
            }
          >
            <FormattedMessage
              id='views.unauthenticated.welcome-screen.sign-up-text.question'
              defaultMessage="Don't have an account yet?"
            />
          </Text>
          <View style={[
            {
              flexDirection: 'row',
              gap: spacing.SCALE_4,
            },
          ]}>
            <Text
              style={[
                styles.signUpButtonText,
                {
                  color: theme.PRIMARY,
                  fontWeight: 'bold',
                }]}
            >
              <FormattedMessage
                id='views.unauthenticated.welcome-screen.sign-up-text.sign-up'
                defaultMessage="Sign Up"
              />
            </Text>
            <Text
              style={
                styles.signUpButtonText
              }
            >
              <FormattedMessage
                id='views.unauthenticated.welcome-screen.sign-up-text.here'
                defaultMessage="here!"
              />
            </Text>
          </View>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: typography.FONT_SIZE_32,
    textAlign: 'center',
    paddingHorizontal: spacing.SCALE_30,
  },
  subTitleText: {
    fontSize: typography.FONT_SIZE_16,
    textAlign: 'center',
    paddingHorizontal: spacing.SCALE_20,
  },
  buttonsContainer: {
    gap: spacing.SCALE_20,
  },
  signUpButtonText: {
    color: 'black',
    fontSize: typography.FONT_SIZE_16,
    textAlign: 'center',
  }
})