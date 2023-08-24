import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native'
import React from 'react'
import { useTheme } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';
import { FormattedMessage } from 'react-intl';
import Button, { buttonTypes } from 'components/button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { SCREENS } from 'navigation/utils/screens';
import { UserType, useUser } from 'context/UserProvider';

//icons:
import WelcomeScreenIcon from 'assets/images/welcome-screen.svg';


type WelcomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'WELCOME_SCREEN'>;

type WelcomeScreenProps = {
  navigation: WelcomeScreenNavigationProp['navigation'];
};

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const theme = useTheme();
  const { user, setUserDetails } = useUser();
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
            onPress={() => {
              const userData: UserType = {
                id: 1,
                firstName: 'Bartek',
                lastName: 'Noga',
                email: 'nogovitz00@gmail.com',
                photoURL: null,
              };
              setUserDetails(userData);

            }}
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
          onPress={() => navigation.navigate(SCREENS.UNAUTHENTICATED.SING_UP_SCREEN.ID)}
          activeOpacity={constants.ACTIVE_OPACITY.HIGH}
        >
          <Text
            style={
              [styles.signUpButtonText, { color: theme.TEXT }]
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
                  color: theme.FIXED_PRIMARY_BLUE,
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
                [styles.signUpButtonText, { color: theme.TEXT }]
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
    fontSize: typography.FONT_SIZE_16,
    textAlign: 'center',
  }
})