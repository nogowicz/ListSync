import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from 'navigation/utils/ThemeProvider';


//components:
import Button, { buttonTypes } from 'components/button'
import { spacing, typography } from 'styles'

export default function SettingsList() {
    const theme = useTheme();
    return (
        <ScrollView
            style={styles.container}
        >
            <View>
                <Text
                    style={[styles.sectionText, { color: theme.TEXT }]}>
                    Preferences
                </Text>
            </View>
            <Button
                text='Language'
                type={buttonTypes.BUTTON_TYPES.SETTING}
                onPress={() => console.log("Setting button pressed")}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: spacing.SCALE_20,
    },
    sectionText: {
        fontSize: typography.FONT_SIZE_20,
    }
})