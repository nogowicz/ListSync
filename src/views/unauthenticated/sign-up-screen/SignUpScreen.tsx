import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { spacing, typography } from 'styles';
import { buttonTypes } from 'components/button';

//components:
import Logo from 'components/logo';
import Button, { backButtonWidth } from 'components/button/Button'


type SignUpScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SIGN_UP_SCREEN'>;

type SignUpScreenProps = {
    navigation: SignUpScreenNavigationProp['navigation'];
};


export default function SignUpScreen({ navigation }: SignUpScreenProps) {
    const theme = useTheme();

    //animations:
    const translateYValue = useRef(new Animated.Value(0)).current;
    const animationDuration = 200;

    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <Animated.View style={[
                styles.container,
                { transform: [{ translateY: translateYValue }] }
            ]}>
                <View style={styles.topContainer}>
                    <Button
                        onPress={() => navigation.goBack()}
                        type={buttonTypes.BUTTON_TYPES.BACK}


                    />
                    <Logo
                        animationDuration={animationDuration}
                    />
                    <View
                        style={{
                            width: backButtonWidth
                        }}
                    />
                </View>

                <View
                    style={styles.textFieldsContainer}
                >
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
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    }
})