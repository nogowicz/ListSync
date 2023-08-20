import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { formatDateToLongDate } from 'utils/dateFormat';
import { constants, typography } from 'styles';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

//components:
import Button, { buttonTypes } from 'components/button';
import { SCREENS } from 'navigation/utils/screens';

type TopPanelProps = {
    name: string;
};

export default function TopPanel({ name }: TopPanelProps) {
    const intl = useIntl();
    const date = formatDateToLongDate(new Date(), intl);
    const theme = useTheme();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                onPress={() => navigation.navigate(SCREENS.AUTHENTICATED.PROFILE.ID as never)}
            >
                <Text style={[styles.greetingText, { color: theme.TEXT }]}>
                    <FormattedMessage
                        id='views.authenticated.home.greetings-text'
                        defaultMessage={"Hi, "}
                    />
                    {name}!
                </Text>
                <Text style={[styles.dateText, { color: theme.HINT }]}>{date}</Text>
            </TouchableOpacity>
            <Button
                onPress={() => console.log("New list button")}
                text={
                    <FormattedMessage
                        id='views.authenticated.home.add-button-text'
                        defaultMessage={"New List"}
                    />
                } type={buttonTypes.BUTTON_TYPES.ADD} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    greetingText: {
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        fontSize: typography.FONT_SIZE_24,
    },
    dateText: {
        fontSize: typography.FONT_SIZE_15,
    },
})