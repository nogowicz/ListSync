import {
    Appearance,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { spacing } from 'styles';
import { LangContext } from '../../lang/LangProvider';
import { FormattedMessage } from 'react-intl';
import { languagesCodes } from 'lang/constants';
import { LANGUAGES_ENTRY, THEMES_ENTRY } from 'views/authenticated/profile/Profile';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { radioButtonsType } from '.';
import { getItem, setItem } from 'utils/asyncStorage';
import { EventRegister } from 'react-native-event-listeners';

type LanguageObject = {
    [key: string]: () => JSX.Element;
};

type CustomRadioButtonsProps = {
    values: LANGUAGES_ENTRY[] | THEMES_ENTRY[];
    type: radioButtonsType.RADIO_BUTTONS_TYPE;
}

type ThemeObject = {
    [key: string]: () => JSX.Element;
};


export default function CustomRadioButton({ values, type }: CustomRadioButtonsProps) {
    const theme = useTheme();
    const [language, setLanguage] = useContext(LangContext);
    const [value, setValue] = useState<string>(languagesCodes[language]);

    const [themeMode, setThemeMode] = useState<boolean>();
    const colorScheme = Appearance.getColorScheme();

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


    const themeTranslation: ThemeObject = {
        "Dark": () => (
            <FormattedMessage
                defaultMessage='Dark'
                id='views.authenticated.profile.app-settings.theme.dark'
            />
        ),
        "Light": () => (
            <FormattedMessage
                defaultMessage='Light'
                id='views.authenticated.profile.app-settings.theme.light'
            />
        ),
    }

    const languageTranslation: LanguageObject = {
        "PL": () => (
            <FormattedMessage
                defaultMessage='Polish'
                id='views.authenticated.profile.app-settings.language.pl'
            />
        ),
        "ENG": () => (
            <FormattedMessage
                defaultMessage='English'
                id='views.authenticated.profile.app-settings.language.eng'
            />
        )
    }


    if (type === radioButtonsType.RADIO_BUTTONS_TYPE.LANGUAGE) {
        return (

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
                                {languageTranslation[res.key]()}
                            </Text>
                        </View>
                    );
                })}
            </View>
        );
    } else if (type === radioButtonsType.RADIO_BUTTONS_TYPE.THEME) {
        return (
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
                                {themeTranslation[res.key]()}
                            </Text>
                        </View>
                    );
                })}
            </View>
        );
    }
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