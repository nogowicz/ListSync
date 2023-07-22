import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { formatDateToLongDate } from 'utils/dateFormat';
import Button from 'components/button';
import { spacing, typography } from 'styles';
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import { FormattedMessage, useIntl } from 'react-intl';

type TopPanelProps = {
    name: string;
};

export default function TopPanel({ name }: TopPanelProps) {
    const intl = useIntl();
    const date = formatDateToLongDate(new Date(), intl);
    const theme = useContext(ThemeContext);
    return (
        <View style={styles.container}>
            <View>
                <Text style={[styles.greetingText, { color: theme.TEXT }]}>
                    <FormattedMessage
                        id='views.authenticated.home.greetings-text'
                        defaultMessage={"Hi, "}
                    />
                    {name}!
                </Text>
                <Text style={[styles.dateText, { color: theme.HINT }]}>{date}</Text>
            </View>
            <Button
                onPress={() => console.log("New list button")}
                text={
                    <FormattedMessage
                        id='views.authenticated.home.add-button-text'
                        defaultMessage={"New List"}
                    />
                } type='add' />
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