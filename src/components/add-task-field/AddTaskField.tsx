import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider'
import { constants, spacing } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';

import AddTaskIcon from 'assets/button-icons/add-task.svg';
import ListSelection from 'assets/button-icons/list-input-selection.svg';
import CalendarSelection from 'assets/button-icons/calendar-input-selection.svg';
import ImportanceSelection from 'assets/button-icons/importance-input-selection.svg';


export default function AddTaskField() {
    const theme = useContext(ThemeContext);
    const intl = useIntl();
    const placeholderText = intl.formatMessage({
        id: 'views.authenticated.home.text-input.placeholder',
        defaultMessage: 'Add new task',
    });
    return (
        <View style={[
            styles.container,
            {
                borderColor: theme.HINT,
                backgroundColor: theme.BACKGROUND,
            }]}>
            <View style={styles.upperContainer}>
                <TouchableOpacity style={styles.buttons}>
                    <ListSelection />
                    <Text style={{ color: theme.HINT }}>
                        <FormattedMessage
                            id='views.authenticated.home.text-input.list-name.all'
                            defaultMessage={'All'}
                        />
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons}>
                    <CalendarSelection />
                    <Text style={{ color: theme.HINT }}>
                        <FormattedMessage
                            id='views.authenticated.home.text-input.deadline.today'
                            defaultMessage={'Today'}
                        />
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons}>
                    <ImportanceSelection />
                    <Text style={{ color: theme.HINT }}>
                        <FormattedMessage
                            id='views.authenticated.home.text-input.importance'
                            defaultMessage={'Importance'}
                        />
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
                <TextInput
                    placeholder={placeholderText}
                    placeholderTextColor={theme.HINT}
                    style={[styles.textInput, { color: theme.TEXT, }]}
                    autoFocus={true}
                />
                <TouchableOpacity>
                    <AddTaskIcon />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        marginBottom: spacing.SCALE_20,
        paddingHorizontal: spacing.SCALE_20,
        paddingVertical: spacing.SCALE_8,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    textInput: {
        maxWidth: '90%',
    },
    upperContainer: {
        flexDirection: 'row',
        gap: spacing.SCALE_20,
        alignItems: 'center',
        marginBottom: spacing.SCALE_8,
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.SCALE_8,
    }
})