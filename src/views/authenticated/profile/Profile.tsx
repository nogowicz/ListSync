import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useRef } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { topPanelTypes } from 'components/top-panel';
import { spacing, typography } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { navigationTypes } from 'components/navigation-top-bar';
import { LANGUAGES } from 'lang/constants';

//components:
import BottomSheet, { BottomSheetRefProps } from 'components/bottom-sheet/BottomSheet';
import NavigationTopBar from 'components/navigation-top-bar';
import TopPanel from 'components/top-panel';
import SettingsList from 'components/settings-list';
import CustomRadioButtons from 'components/custom-radio-buttons';

type ProfilePropsNavigationProp = NativeStackScreenProps<RootStackParamList, 'PROFILE'>;

type ProfileProps = {
    navigation: ProfilePropsNavigationProp['navigation'];
};

export type Entry = {
    key: string;
    value: string;
};


export default function Profile({ navigation }: ProfileProps) {
    const theme = useTheme();
    const intl = useIntl();

    //translations:
    const screenNameTranslation = intl.formatMessage({
        id: 'views.authenticated.profile.profile',
        defaultMessage: 'Profile'
    });

    const refLang = useRef<BottomSheetRefProps>(null);

    const langSheetOpen = useRef(false);

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

    const langArray: Entry[] = Object.entries(LANGUAGES).map(([key, value]) => ({ key, value }));

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
                />
            </View>
            <BottomSheet ref={refLang} height={500}>
                <Text style={[styles.bottomSheetTitleText, { color: theme.TEXT }]}>
                    <FormattedMessage
                        id='views.authenticated.profile.app-settings.choose-language'
                        defaultMessage='Choose Language'
                    />
                </Text>
                <CustomRadioButtons values={langArray} />
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