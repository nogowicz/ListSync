import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { ReactNode, cloneElement } from 'react'
import { useTheme } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from 'navigation/utils/screens';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { NAVIGATION_TOP_BAR_TYPES } from './navigationTopBarTypes';

//icons: 
import Details from 'assets/button-icons/details.svg';

//components:
import Button, { buttonTypes } from 'components/button';
import { backButtonWidth } from 'components/button/Button';

type NavigationTopBarProps = {
    name: string;
    icon?: ReactNode;
    color?: string;
    onTitlePress?: () => void;
    type: NAVIGATION_TOP_BAR_TYPES;
};

export default function NavigationTopBar({ name, icon, onTitlePress, color, type }: NavigationTopBarProps) {
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const getFontSize = (textLength: number) => {
        if (textLength <= 7) {
            return typography.FONT_SIZE_32;
        } else if (textLength > 7 && textLength <= 16) {
            return typography.FONT_SIZE_20;
        } else {
            return typography.FONT_SIZE_14;
        }
    };
    const fontSize = getFontSize(name.length);
    if (type === NAVIGATION_TOP_BAR_TYPES.LIST) {
        return (
            <View style={styles.container}>
                <Button
                    onPress={() => {
                        navigation.navigate(SCREENS.AUTHENTICATED.HOME.ID)
                    }}
                    type={buttonTypes.BUTTON_TYPES.BACK}
                />
                <TouchableOpacity
                    activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                    style={styles.iconAndNameContainer}
                    onPress={onTitlePress}
                >
                    {cloneElement(icon as JSX.Element, { fill: color })}

                    <Text style={{
                        fontSize: fontSize,
                        color: theme.TEXT,
                    }}>
                        {name}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                    style={{
                        padding: spacing.SCALE_12,
                    }}>
                    <Details />
                </TouchableOpacity>

            </View>
        );
    } else if (type === NAVIGATION_TOP_BAR_TYPES.BASIC) {
        return (
            <View style={styles.container}>
                <Button
                    onPress={() => {
                        navigation.navigate(SCREENS.AUTHENTICATED.HOME.ID)
                    }}
                    type={buttonTypes.BUTTON_TYPES.BACK}
                />
                <View
                    style={styles.iconAndNameContainer}
                >
                    <Text style={{
                        fontSize: spacing.SCALE_30,
                        color: theme.TEXT,
                        textAlign: 'center',
                    }}>
                        {name}
                    </Text>
                </View>
                <TouchableOpacity
                    activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                    style={{
                        padding: spacing.SCALE_12,
                    }}>
                    <View
                        style={{ width: backButtonWidth - spacing.SCALE_20 }}
                    />
                </TouchableOpacity>

            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.SCALE_30,
    },
    iconAndNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.SCALE_20,
        justifyContent: 'center',

    }
})