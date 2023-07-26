import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { ReactNode, useContext } from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider'
import { constants, spacing, typography } from 'styles';
import { FormattedMessage } from 'react-intl';

import GoBack from 'assets/button-icons/Back.svg';
import Details from 'assets/button-icons/details.svg';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from 'navigation/utils/screens';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';

type ListTopBar = {
    name: string;
    icon: ReactNode;
};

export default function ListTopBar({ name, icon }: ListTopBar) {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const getFontSize = (textLength: number) => {
        if (textLength <= 7) {
            return typography.FONT_SIZE_32;
        } else if (textLength > 7 && textLength <= 11) {
            return typography.FONT_SIZE_20;
        } else {
            return typography.FONT_SIZE_14;
        }
    };
    const fontSize = getFontSize(name.length);
    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.backButton, { borderColor: theme.LIGHT_HINT, }]}
                onPress={() => navigation.navigate(SCREENS.AUTHENTICATED.HOME.ID)}
            >
                <GoBack />
            </TouchableOpacity>
            <View style={styles.iconAndNameContainer}>

                {icon}

                <Text style={{
                    fontSize: fontSize,
                    color: theme.TEXT,
                }}>
                    {name}
                </Text>
            </View>
            <TouchableOpacity
                activeOpacity={0.5}
                style={{
                    padding: spacing.SCALE_12,
                }}>
                <Details />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.SCALE_30,
    },
    backButton: {
        borderWidth: 1,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        padding: spacing.SCALE_12,
    },
    iconAndNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.SCALE_20,
        justifyContent: 'center',

    }
})