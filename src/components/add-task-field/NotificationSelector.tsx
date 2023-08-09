import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import React, {
    Dispatch,
    SetStateAction,
    cloneElement,
    useContext,
} from 'react'
import { constants, spacing, typography } from 'styles';
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import { FormattedMessage } from 'react-intl';

import TodayLater from 'assets/button-icons/later_today.svg';
import Tomorrow from 'assets/button-icons/tomorrow.svg';
import NextWeek from 'assets/button-icons/next_week.svg';
import PickTime from 'assets/button-icons/pick_time.svg';
import RemoveNotification from 'assets/button-icons/remove_notification.svg';
import { getFormattedDate } from 'utils/dateFormat';


export const notificationTimeNames = {
    TODAY: "Today",
    TOMORROW: "Tomorrow",
    NEXT_WEEK: "Next week",
    PICK_DATE: "Pick date",
    REMOVE: "Set notification",
}

type NotificationSelectorProps = {
    setNotification: Dispatch<SetStateAction<string>>;
    notification: string;
    setIsNotificationVisible: Dispatch<SetStateAction<boolean>>;
    onPickDatePress: any;
}


export default function NotificationSelector({
    setNotification,
    notification,
    setIsNotificationVisible,
    onPickDatePress
}: NotificationSelectorProps) {
    const theme = useContext(ThemeContext);

    const dates = [
        {
            id: "views.authenticated.home.text-input.notification.today",
            icon: (<TodayLater />),
            value: notificationTimeNames.TODAY,
            isVisible: (notification !== notificationTimeNames.TODAY),
            onPress: () => {
                setNotification(notificationTimeNames.TODAY);
                const date: string | null = getFormattedDate(notificationTimeNames.TODAY);
                setIsNotificationVisible(false);
            }
        },
        {
            id: "views.authenticated.home.text-input.notification.tomorrow",
            icon: (<Tomorrow />),
            value: notificationTimeNames.TOMORROW,
            isVisible: (notification !== notificationTimeNames.TOMORROW),
            onPress: () => {
                setNotification(notificationTimeNames.TOMORROW);
                const date: string | null = getFormattedDate(notificationTimeNames.TOMORROW);
                setIsNotificationVisible(false);
            }
        },
        {
            id: "views.authenticated.home.text-input.notification.next-week",
            icon: (<NextWeek />),
            value: notificationTimeNames.NEXT_WEEK,
            isVisible: (notification !== notificationTimeNames.NEXT_WEEK),
            onPress: () => {
                setNotification(notificationTimeNames.NEXT_WEEK);
                const date: string | null = getFormattedDate(notificationTimeNames.NEXT_WEEK);
                setIsNotificationVisible(false);
            }
        },
        {
            id: "views.authenticated.home.text-input.notification.pick-date",
            icon: (<PickTime />),
            value: notificationTimeNames.PICK_DATE,
            isVisible: (notification !== notificationTimeNames.PICK_DATE),
            onPress: () => {
                onPickDatePress();
            }
        },
        {
            id: "views.authenticated.home.text-input.notification.remove",
            icon: (<RemoveNotification />),
            value: notificationTimeNames.REMOVE,
            isVisible: (notification !== notificationTimeNames.REMOVE),
            onPress: () => {
                setNotification(notificationTimeNames.REMOVE);
                const date: string | null = getFormattedDate(notificationTimeNames.REMOVE);
                setIsNotificationVisible(false);
            }
        },
    ]

    return (
        <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            keyboardShouldPersistTaps='always'
        >
            <View style={{
                flexDirection: 'row',
                marginVertical: spacing.SCALE_12,
                gap: spacing.SCALE_12,
            }}>
                {dates.map((date) => (
                    date.isVisible && (
                        <TouchableOpacity
                            activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                            key={date.id}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: spacing.SCALE_85,
                                marginLeft: -spacing.SCALE_12,
                            }}
                            onPress={date.onPress}
                        >
                            {cloneElement(date.icon as JSX.Element, {
                                stroke: theme.PRIMARY,
                                width: constants.ICON_SIZE.TEXT_FIELD_LIST_ICON,
                                height: constants.ICON_SIZE.TEXT_FIELD_LIST_ICON,
                                strokeWidth: 1.5,
                            })}
                            <Text style={{
                                color: theme.PRIMARY,
                                fontSize: typography.FONT_SIZE_12,
                                textAlign: 'center',

                            }}>
                                <FormattedMessage
                                    id={date.id}
                                    defaultMessage={date.value}
                                />
                            </Text>
                        </TouchableOpacity>
                    )))}
            </View>
        </ScrollView>
    )
}
