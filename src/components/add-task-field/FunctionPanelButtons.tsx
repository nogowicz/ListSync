import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, Dispatch, SetStateAction, } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { constants, spacing } from 'styles'
import { useTheme } from 'navigation/utils/ThemeProvider';
import { ListType } from 'data/types'
import { deadlineNames } from './DeadlineSelector'
import { formatDateToShortDate, formatDateToShortDateWithTime, isToday, isTomorrow } from 'utils/dateFormat'
import { notificationTimeNames } from './NotificationSelector'

//icons
import ListSelection from 'assets/button-icons/list-input-selection.svg';
import CalendarSelection from 'assets/button-icons/calendar-input-selection.svg';
import NotificationBell from 'assets/button-icons/notification-bell.svg';
import ImportanceSelectionIcon from 'assets/button-icons/importance-input-selection.svg';
import { importanceNames } from './ImportanceSelector'


export enum FUNCTIONAL_BUTTONS_NAMES {
    LIST = 'list',
    DEADLINE = 'deadline',
    NOTIFICATION = 'notification',
    IMPORTANCE = 'importance'
}

type FunctionPanelButtonsProps = {
    type: FUNCTIONAL_BUTTONS_NAMES,
    setIsListVisible: Dispatch<SetStateAction<boolean>>;
    isListVisible?: boolean;
    setIsDeadlineVisible: Dispatch<SetStateAction<boolean>>;
    isDeadlineVisible?: boolean;
    setIsNotificationVisible: Dispatch<SetStateAction<boolean>>;
    isNotificationVisible?: boolean;
    setIsImportanceVisible: Dispatch<SetStateAction<boolean>>;
    isImportanceVisible?: boolean;
    activeList?: ListType;
    deadline?: string;
    notification?: string;
    notificationTime: string | null;
    importance?: string;
    deadlineDate: string | null;
}

export default function FunctionPanelButtons({
    type,
    setIsListVisible,
    isListVisible,
    setIsDeadlineVisible,
    setIsNotificationVisible,
    activeList,
    isDeadlineVisible,
    isNotificationVisible,
    setIsImportanceVisible,
    isImportanceVisible,
    deadline,
    deadlineDate,
    notification,
    notificationTime,
    importance,
}: FunctionPanelButtonsProps) {
    const theme = useTheme();
    const intl = useIntl();

    //translations:
    const deadlineTranslation: { [key: string]: React.JSX.Element } = {
        'Deadline': (
            <FormattedMessage
                id='views.authenticated.home.text-input.deadline.set'
                defaultMessage={deadline}
            />
        ),
        'Today': (
            <FormattedMessage
                id='views.authenticated.home.text-input.deadline.today'
                defaultMessage={deadline}
            />
        ),
        'Tomorrow': (
            <FormattedMessage
                id='views.authenticated.home.text-input.deadline.tomorrow'
                defaultMessage={deadline}
            />
        ),
        'Next week': (
            <FormattedMessage
                id='views.authenticated.home.text-input.deadline.next-week'
                defaultMessage={deadline}
            />
        ),
        'Pick date': (
            <FormattedMessage
                id='views.authenticated.home.text-input.deadline.pick-date'
                defaultMessage={deadline}
            />
        )
    };

    const importanceTranslation: { [key: string]: React.JSX.Element } = {
        'Empty': (
            <FormattedMessage
                id='views.authenticated.home.text-input.importance.empty'
                defaultMessage={importance}
            />
        ),
        'Low': (
            <FormattedMessage
                id='views.authenticated.home.text-input.importance.low'
                defaultMessage={importance}
            />
        ),
        'Medium': (
            <FormattedMessage
                id='views.authenticated.home.text-input.importance.medium'
                defaultMessage={importance}
            />
        ),
        'High': (
            <FormattedMessage
                id='views.authenticated.home.text-input.importance.high'
                defaultMessage={importance}
            />
        ),
    };


    const allListTranslation = intl.formatMessage({
        defaultMessage: "All",
        id: "views.authenticated.home.text-input.list-name.all"
    });

    const unnamedListTranslation = intl.formatMessage({
        defaultMessage: "Unnamed list",
        id: "views.authenticated.home.text-input.list-name.unnamed-list"
    });

    if (type === FUNCTIONAL_BUTTONS_NAMES.LIST) {
        return (
            <TouchableOpacity
                style={styles.buttons}
                onPress={() => {
                    setIsListVisible(!isListVisible)
                    setIsDeadlineVisible(false);
                    setIsNotificationVisible(false);
                    setIsImportanceVisible(false);
                }}
            >
                <ListSelection
                    stroke={activeList?.IdList === 1 ? theme.HINT : theme.PRIMARY}
                    strokeWidth={constants.STROKE_WIDTH.ICON}
                />
                <Text style={{
                    color: activeList?.IdList === 1 ? theme.HINT : theme.PRIMARY,
                }}>


                    {activeList?.listName === "All" ? allListTranslation :
                        activeList?.listName === "Unnamed list" ? unnamedListTranslation : activeList?.listName}
                </Text>
            </TouchableOpacity>
        );
    } else if (type === FUNCTIONAL_BUTTONS_NAMES.DEADLINE && deadline) {
        return (
            <TouchableOpacity
                style={styles.buttons}
                onPress={() => {
                    setIsDeadlineVisible(!isDeadlineVisible)
                    setIsListVisible(false);
                    setIsNotificationVisible(false);
                    setIsImportanceVisible(false);
                }}
            >
                <CalendarSelection
                    fill={deadline === deadlineNames.REMOVE ? theme.HINT : theme.PRIMARY}
                />
                <Text
                    style={{
                        color: deadline === deadlineNames.REMOVE ? theme.HINT : theme.PRIMARY,
                    }}
                >
                    {deadline !== deadlineNames.NEXT_WEEK && deadline !== deadlineNames.PICK_DATE ? (
                        deadline === deadlineNames.TODAY ? deadlineNames.TODAY : deadline === deadlineNames.TOMORROW ? deadlineNames.TOMORROW : deadlineTranslation[deadline]
                    ) : (
                        isToday(new Date(deadlineDate as string)) ? deadlineNames.TODAY : isTomorrow(new Date(deadlineDate as string)) ? deadlineNames.TOMORROW : formatDateToShortDate(new Date(deadlineDate as string), intl)
                    )}
                </Text>

            </TouchableOpacity>
        );
    } else if (type === FUNCTIONAL_BUTTONS_NAMES.NOTIFICATION) {
        return (
            <TouchableOpacity
                style={styles.buttons}
                onPress={() => {
                    setIsNotificationVisible(!isNotificationVisible)
                    setIsListVisible(false);
                    setIsDeadlineVisible(false);
                    setIsImportanceVisible(false);
                }}
            >
                <NotificationBell
                    stroke={notification === notificationTimeNames.REMOVE ? theme.HINT : theme.PRIMARY}
                    strokeWidth={constants.STROKE_WIDTH.ICON}
                />
                <Text
                    style={{
                        color: notification === notificationTimeNames.REMOVE ? theme.HINT : theme.PRIMARY,
                    }}
                >
                    {(!notificationTime || notification === notificationTimeNames.REMOVE) ?
                        <FormattedMessage
                            id='views.authenticated.home.text-input.notification'
                            defaultMessage={'Notification'}
                        /> :
                        formatDateToShortDateWithTime(new Date(notificationTime), intl)
                    }

                </Text>
            </TouchableOpacity>
        );
    } else if (type === FUNCTIONAL_BUTTONS_NAMES.IMPORTANCE && importance) {
        return (
            <TouchableOpacity
                style={styles.buttons}
                onPress={() => {
                    setIsImportanceVisible(!isImportanceVisible)
                    setIsListVisible(false);
                    setIsDeadlineVisible(false);
                    setIsNotificationVisible(false);
                }}
            >
                <ImportanceSelectionIcon
                    stroke={importance === importanceNames.REMOVE ? theme.HINT : theme.PRIMARY}
                    strokeWidth={constants.STROKE_WIDTH.ICON}
                />
                <Text style={{
                    color: importance === importanceNames.REMOVE ? theme.HINT : theme.PRIMARY,
                }}>
                    {importance === importanceNames.REMOVE ?
                        <FormattedMessage
                            id='views.authenticated.home.text-input.importance'
                            defaultMessage={'Importance'}
                        /> :
                        importanceTranslation[importance]
                    }
                </Text>
            </TouchableOpacity>
        );
    }
    else {
        return (
            <View>
                <Text>FunctionPanelButtons</Text>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.SCALE_8,
    },
})