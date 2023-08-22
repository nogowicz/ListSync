import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useContext, useState } from 'react'
import { spacing } from 'styles';
import { LangContext } from '../../lang/LangProvider';
import { FormattedMessage } from 'react-intl';
import { languagesCodes } from 'lang/constants';
import { Entry } from 'views/authenticated/profile/Profile';
import { useTheme } from 'navigation/utils/ThemeProvider';

type LanguageObject = {
    [key: string]: () => JSX.Element;
};

type CustomRadioButtonsProps = {
    values: Entry[];
}

export default function CutomRadioButton({ values }: CustomRadioButtonsProps) {
    const theme = useTheme();
    const [language, setLanguage] = useContext(LangContext);
    const [value, setValue] = useState<string>(languagesCodes[language]);
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

    return (
        <View>
            {values.map(res => {
                return (
                    <View key={res.key} style={styles.container}>
                        <TouchableOpacity
                            style={[styles.radioCircle, { borderColor: theme.TEXT }]}
                            onPress={() => {
                                setLanguage(res.value)
                                setValue(res.key);
                            }}>
                            {value === res.key && <View style={[styles.selectedRb, { backgroundColor: theme.TEXT }]} />}
                        </TouchableOpacity>
                        <Text style={[styles.radioText, { color: theme.TEXT }]}>
                            {languageTranslation[res.key]()}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
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