import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useRef } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { topPanelTypes } from 'components/top-panel';
import { constants, spacing, typography } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { navigationTypes } from 'components/navigation-top-bar';
import { LANGUAGES } from 'lang/constants';

//components:
import BottomSheet, { BottomSheetRefProps } from 'components/bottom-sheet/BottomSheet';
import NavigationTopBar from 'components/navigation-top-bar';
import TopPanel from 'components/top-panel';
import SettingsList from 'components/settings-list';
import CustomRadioButtons, { radioButtonsType } from 'components/custom-radio-buttons';

type ProfilePropsNavigationProp = NativeStackScreenProps<RootStackParamList, 'PROFILE'>;

type ProfileProps = {
    navigation: ProfilePropsNavigationProp['navigation'];
};

export type LANGUAGES_ENTRY = {
    key: string;
    value: string;
};


export type THEMES_ENTRY = {
    key: string;
    value: boolean;
}

export default function Profile({ navigation }: ProfileProps) {
    const theme = useTheme();
    const intl = useIntl();

    //translations:
    const screenNameTranslation = intl.formatMessage({
        id: 'views.authenticated.profile.profile',
        defaultMessage: 'Profile'
    });

    const langSheetOpen = useRef(false);
    const refLang = useRef<BottomSheetRefProps>(null);
    const themeSheetOpen = useRef(false);
    const refTheme = useRef<BottomSheetRefProps>(null);


    const handleShowLangBottomSheet = useCallback(() => {
        // if (themeSheetOpen.current) {
        //     refTheme.current?.scrollTo(0);
        // }
        langSheetOpen.current = !langSheetOpen.current;
        if (!langSheetOpen.current) {
            refLang.current?.scrollTo(0);
        } else {
            refLang.current?.scrollTo(-200);
        }
    }, []);

    const langArray: LANGUAGES_ENTRY[] = Object.entries(LANGUAGES).map(([key, value]) => ({ key, value }));

    const handleShowThemeBottomSheet = useCallback(() => {
        if (langSheetOpen.current) {
            refLang.current?.scrollTo(0);
        }
        themeSheetOpen.current = !themeSheetOpen.current;
        if (!themeSheetOpen.current) {
            refTheme.current?.scrollTo(0);
        } else {
            refTheme.current?.scrollTo(-200);
        }
    }, []);

    const themesEntry = {
        Dark: true,
        Light: false,
    }

    const themesArray = Object.entries(themesEntry).map(([key, value]) => ({ key, value }));

    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <NavigationTopBar
                    type={navigationTypes.NAVIGATION_TOP_BAR_TYPES.BASIC}
                    name={screenNameTranslation}
                />
                <TopPanel
                    type={topPanelTypes.TOP_PANEL_TYPES.PROFILE_SCREEN}
                />
                <SettingsList
                    handleShowLangBottomSheet={handleShowLangBottomSheet}
                    handleShowThemeBottomSheet={handleShowThemeBottomSheet}
                />
            </View>
            <BottomSheet ref={refLang} height={constants.BOTTOM_SHEET_HEIGHT.LANGUAGES}>
                <Text style={[styles.bottomSheetTitleText, { color: theme.FIXED_DARK_TEXT }]}>
                    <FormattedMessage
                        id='views.authenticated.profile.app-settings.choose-language'
                        defaultMessage='Choose Language'
                    />
                </Text>
                <CustomRadioButtons values={langArray} type={radioButtonsType.RADIO_BUTTONS_TYPE.LANGUAGE} />
            </BottomSheet>

            <BottomSheet ref={refTheme} height={constants.BOTTOM_SHEET_HEIGHT.THEMES}>
                <Text style={[styles.bottomSheetTitleText, { color: theme.FIXED_DARK_TEXT }]}>
                    <FormattedMessage
                        defaultMessage='Choose Theme'
                        id='views.authenticated.profile.app-settings.theme.choose-theme'
                    />
                </Text>
                <CustomRadioButtons values={themesArray} type={radioButtonsType.RADIO_BUTTONS_TYPE.THEME} />
            </BottomSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        marginHorizontal: spacing.SCALE_20,
        marginTop: spacing.SCALE_20,
        flex: 1,
    },
    bottomSheetTitleText: {
        ...typography.FONT_BOLD,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: typography.FONT_SIZE_20,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        textAlign: 'center',
        marginBottom: spacing.SCALE_20,
    }
})