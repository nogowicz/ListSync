import { radioButtonsType } from "components/custom-radio-buttons";
import { useTheme } from "navigation/utils/ThemeProvider";
import { Appearance, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { spacing } from "styles";
import { useContext, useEffect, useState } from 'react';
import { LangContext } from "lang/LangProvider";
import { LANGUAGES_ENTRY, THEMES_ENTRY } from "views/authenticated/profile/Profile";
import { EventRegister } from "react-native-event-listeners";
import { getItem, setItem } from "utils/asyncStorage";
import { useIntl } from "react-intl";
import { languagesCodes } from "lang/constants";

type TranslationObject = {
    [key: string]: string;
};

type PrepareRadioButtonsProps = {
    values: LANGUAGES_ENTRY[] | THEMES_ENTRY[];
};

export function prepareRadioButtons({
    values,
}: PrepareRadioButtonsProps) {
    const theme = useTheme();
    const [language, setLanguage] = useContext(LangContext);
    const [value, setValue] = useState<string>(languagesCodes[language]);
    const [themeMode, setThemeMode] = useState<boolean>();
    const colorScheme = Appearance.getColorScheme();
    const intl = useIntl();

    const themeTranslation: TranslationObject = {
        "Dark": intl.formatMessage({
            id: 'views.authenticated.profile.app-settings.theme.dark',
            defaultMessage: 'Dark'
        }),
        "Light": intl.formatMessage({
            id: 'views.authenticated.profile.app-settings.theme.light',
            defaultMessage: 'Light'
        }),
    }

    const languageTranslation: TranslationObject = {
        "PL": intl.formatMessage({
            id: 'views.authenticated.profile.app-settings.language.pl',
            defaultMessage: 'Polish'
        }),
        "ENG": intl.formatMessage({
            id: 'views.authenticated.profile.app-settings.language.eng',
            defaultMessage: 'English'
        }),
    };



    useEffect(() => {
        const fetchThemeMode = async () => {
            await getItem('theme').then((storedTheme) => {
                console.log(storedTheme)
                if (storedTheme !== null) {
                    setThemeMode(storedTheme === "false" ? false : true);
                } else {
                    setThemeMode(colorScheme === "dark" ? true : false);
                }
            });
        };

        fetchThemeMode();
    }, []);


    return [
        {
            type: radioButtonsType.RADIO_BUTTONS_TYPE.LANGUAGE,
            radioButton: (
                <View>
                    {values.map(res => {
                        return (
                            <View key={res.key} style={styles.container}>
                                <TouchableOpacity
                                    style={[styles.radioCircle, { borderColor: theme.FIXED_DARK_TEXT }]}
                                    onPress={() => {
                                        setLanguage(res.value as string)
                                        setValue(res.key);
                                    }}>
                                    {value === res.key && <View style={[styles.selectedRb, { backgroundColor: theme.FIXED_DARK_TEXT }]} />}
                                </TouchableOpacity>
                                <Text style={[styles.radioText, { color: theme.FIXED_DARK_TEXT }]}>
                                    {/* {console.log(res.key)} */}
                                    {languageTranslation[res.key]}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            )
        },
        {
            type: radioButtonsType.RADIO_BUTTONS_TYPE.THEME,
            radioButton: (
                <View>
                    {values.map(res => {
                        return (
                            <View key={res.key} style={styles.container}>
                                <TouchableOpacity
                                    style={[styles.radioCircle, { borderColor: theme.FIXED_DARK_TEXT }]}
                                    onPress={() => {
                                        EventRegister.emit("changeTheme", res.value);
                                        setThemeMode(res.value as boolean)
                                        setItem('theme', res.value.toString());
                                    }}>
                                    {themeMode === res.value && <View style={[styles.selectedRb, { backgroundColor: theme.FIXED_DARK_TEXT }]} />}
                                </TouchableOpacity>
                                <Text style={[styles.radioText, { color: theme.FIXED_DARK_TEXT }]}>
                                    {themeTranslation[res.key]}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            )
        }
    ];
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 35,
        alignItems: 'center',
        flexDirection: 'row',
        gap: spacing.SCALE_20,
        marginHorizontal: spacing.SCALE_20,
    },
    radioText: {
        marginRight: 35,
        fontSize: 20,
        fontWeight: '700'
    },
    radioCircle: {
        height: 30,
        width: 30,
        borderRadius: 100,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: 15,
        height: 15,
        borderRadius: 50,
    },
});