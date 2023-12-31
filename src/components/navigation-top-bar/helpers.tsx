import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { constants, spacing, typography } from "styles";
import { navigationTypes } from ".";
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from "navigation/utils/screens";
import { useTheme } from "navigation/utils/ThemeProvider";
import { backButtonWidth } from "components/button/Button";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "navigation/navigation";
import { ReactNode, cloneElement } from "react";

//icons: 
import Details from 'assets/button-icons/details.svg';

//components:
import Button, { buttonTypes } from "components/button";
import { useIntl } from "react-intl";

type PrepareNavigationTopBarProps = {
    name: string;
    icon?: ReactNode;
    color?: string;
    onTitlePress?: () => void;
    handleShowDetailsBottomSheet?: () => void;
    extraActionWhenGoBackPressed?: () => void;
};

export function prepareNavigationTopBar({
    name,
    onTitlePress,
    icon,
    color,
    handleShowDetailsBottomSheet,
    extraActionWhenGoBackPressed
}: PrepareNavigationTopBarProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const theme = useTheme();
    const intl = useIntl();

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

    const allListTranslation = intl.formatMessage({
        defaultMessage: "All",
        id: "views.authenticated.home.text-input.list-name.all"
    });

    const unnamedListTranslation = intl.formatMessage({
        defaultMessage: "Unnamed list",
        id: "views.authenticated.home.text-input.list-name.unnamed-list"
    });



    return [
        {
            type: navigationTypes.NAVIGATION_TOP_BAR_TYPES.BASIC,
            navigationTopBar: (
                <View style={styles.container}>
                    <Button
                        onPress={() => {
                            navigation.navigate(SCREENS.AUTHENTICATED.HOME.ID)
                            if (extraActionWhenGoBackPressed) {
                                extraActionWhenGoBackPressed();
                            }
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
                        }}
                        >
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
        },
        {
            type: navigationTypes.NAVIGATION_TOP_BAR_TYPES.LIST,
            navigationTopBar: (
                <View style={styles.container}>
                    <Button
                        onPress={() => {
                            navigation.navigate(SCREENS.AUTHENTICATED.HOME.ID)
                            if (extraActionWhenGoBackPressed) {
                                extraActionWhenGoBackPressed();
                            }
                        }}
                        type={buttonTypes.BUTTON_TYPES.BACK}
                    />
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        style={styles.iconAndNameContainer}
                        onPress={onTitlePress}
                    >
                        {icon && cloneElement(icon as JSX.Element, { fill: color })}

                        <Text style={{
                            fontSize: fontSize,
                            color: theme.TEXT,
                            width: '56%',
                        }}
                            numberOfLines={3}
                            ellipsizeMode="tail"
                        >
                            {name === "All" ? allListTranslation :
                                name === "Unnamed list" ? unnamedListTranslation : name}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                        style={{
                            padding: spacing.SCALE_12,
                        }}
                        onPress={handleShowDetailsBottomSheet}
                    >
                        <Details fill={theme.TEXT} />
                    </TouchableOpacity>

                </View>
            )
        }
    ];
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