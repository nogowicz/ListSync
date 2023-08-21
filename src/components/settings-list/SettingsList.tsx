import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from 'navigation/utils/ThemeProvider';
import { useUser } from 'context/UserProvider';
import { settingsTranslations } from '.';
import { spacing, typography } from 'styles'
import { useIntl } from 'react-intl';


//components:
import Button, { buttonTypes } from 'components/button'

export default function SettingsList() {
    const theme = useTheme();
    const { setUserDetails } = useUser();
    const intl = useIntl();

    return (
        <ScrollView
            style={styles.container}
        >
            <View style={styles.settingsSection}>
                <View>
                    <Text
                        style={[styles.sectionText, { color: theme.TEXT }]}>
                        {settingsTranslations.languageTranslation(intl)}
                    </Text>
                </View>
                <Button
                    text={settingsTranslations.languageTranslation(intl)}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    onPress={() => console.log("Language button pressed")}
                />
                <Button
                    text={settingsTranslations.themeTranslation(intl)}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    onPress={() => console.log("Language button pressed")}
                />
                <Button
                    text={settingsTranslations.favoriteListTranslation(intl)}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    onPress={() => console.log("Language button pressed")}
                />
                <Button
                    text={settingsTranslations.notificationSoundTranslation(intl)}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    onPress={() => console.log("Language button pressed")}
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
                    onPress={() => console.log("Language button pressed")}
                />
                <Button
                    text={settingsTranslations.completedTasksTranslation(intl)}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    onPress={() => console.log("Language button pressed")}
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
                    color={'red'}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    onPress={() => setUserDetails(null)}
                />
                <Button
                    text={settingsTranslations.aboutAppTranslation(intl)}
                    type={buttonTypes.BUTTON_TYPES.SETTING}
                    onPress={() => console.log("Language button pressed")}
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