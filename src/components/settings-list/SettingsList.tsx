import React from 'react'
import { ScrollView, StyleSheet, Text, View, Linking, } from 'react-native'
import { useTheme } from 'navigation/utils/ThemeProvider';
import { settingsTranslations } from '.';
import { spacing, typography } from 'styles'
import { useIntl } from 'react-intl';
import { useAuth } from 'context/AuthContext';


//components:
import Button, { buttonTypes } from 'components/button'

//icons:
import LanguageIcon from 'assets/button-icons/language.svg';
import ThemeIcon from 'assets/button-icons/theme.svg';
import FavoriteListIcon from 'assets/button-icons/favorite.svg';
import NotificationSoundIcon from 'assets/button-icons/notification-bell.svg';
import LogoutIcon from 'assets/button-icons/logout.svg';
import AboutIcon from 'assets/button-icons/about.svg';
import TagIcon from 'assets/button-icons/tag.svg';
import CompletedTasksIcon from 'assets/button-icons/completed_tasks.svg';

type SettingListProps = {
    handleShowLangBottomSheet: Function;
    handleShowThemeBottomSheet: Function;
};

export default function SettingsList({ handleShowLangBottomSheet, handleShowThemeBottomSheet }: SettingListProps) {
    const theme = useTheme();
    const { logout } = useAuth();
    const intl = useIntl();

    return (
        <ScrollView
            style={styles.container}
        >
            <View style={styles.settingsSection}>
                <View>
                    <Text
                        style={[styles.sectionText, { color: theme.TEXT }]}>
                        {settingsTranslations.preferencesTranslation(intl)}
                    </Text>
                </View>
                <Button
                    text={settingsTranslations.languageTranslation(intl)}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    icon={<LanguageIcon />}
                    onPress={() => handleShowLangBottomSheet()}
                />
                <Button
                    text={settingsTranslations.themeTranslation(intl)}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    icon={<ThemeIcon />}
                    onPress={() => handleShowThemeBottomSheet()}
                />
                <Button
                    text={settingsTranslations.favoriteListTranslation(intl)}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    icon={<FavoriteListIcon />}
                    onPress={() => console.log("Favorite button pressed")}
                />
                <Button
                    text={settingsTranslations.notificationSoundTranslation(intl)}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    icon={<NotificationSoundIcon />}
                    onPress={() => {
                        Linking.openSettings();
                    }}
                />

            </View>
            <View style={styles.settingsSection}>
                <View>
                    <Text
                        style={[styles.sectionText, { color: theme.TEXT }]}>
                        {settingsTranslations.tasksTranslation(intl)}
                    </Text>
                </View>
                <Button
                    text={settingsTranslations.tagsTranslation(intl)}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    icon={<TagIcon />}
                    onPress={() => console.log("Tags button pressed")}
                />
                <Button
                    text={settingsTranslations.completedTasksTranslation(intl)}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    icon={<CompletedTasksIcon />}
                    onPress={() => console.log("Completed tasks button pressed")}
                />
            </View>
            <View style={styles.settingsSection}>
                <View>
                    <Text
                        style={[styles.sectionText, { color: theme.TEXT }]}>
                        {settingsTranslations.listSyncTranslation(intl)}
                    </Text>
                </View>
                <Button
                    text={settingsTranslations.logoutTranslation(intl)}
                    color={theme.DARK_RED}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    icon={<LogoutIcon />}
                    onPress={() => logout()}
                />
                <Button
                    text={settingsTranslations.aboutAppTranslation(intl)}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    icon={<AboutIcon />}
                    onPress={() => console.log("About button pressed")}
                />

            </View>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: spacing.SCALE_20,
    },
    sectionText: {
        fontSize: typography.FONT_SIZE_18,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        marginLeft: spacing.SCALE_10,
        marginBottom: spacing.SCALE_10,
    },
    settingsSection: {
        marginBottom: spacing.SCALE_16,
    }
})