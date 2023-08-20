import { StyleSheet, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { topPanelTypes } from 'components/top-panel';
import { spacing } from 'styles';
import { useIntl } from 'react-intl';
import { navigationTypes } from 'components/navigation-top-bar';

//components:
import NavigationTopBar from 'components/navigation-top-bar';
import TopPanel from 'components/top-panel';

type ProfilePropsNavigationProp = NativeStackScreenProps<RootStackParamList, 'PROFILE'>;

type ProfileProps = {
    navigation: ProfilePropsNavigationProp['navigation'];
};


export default function Profile({ navigation }: ProfileProps) {
    const theme = useTheme();
    const intl = useIntl();

    //translations:
    const screenNameTranslation = intl.formatMessage({
        id: 'views.authenticated.profile.profile',
        defaultMessage: 'Profile'
    });

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
        marginTop: spacing.SCALE_20,
        flex: 1,
    },

})