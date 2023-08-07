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
    setDeadline: Dispatch<SetStateAction<string>>;
    deadline: string;
    setIsDeadlineVisible: Dispatch<SetStateAction<boolean>>;
    setDeadlineDate: Dispatch<SetStateAction<string | null>>;
    setShowDateTimePicker: Dispatch<SetStateAction<boolean>>;
    onPickDatePress: any;
}


export default function NotificationSelector({
    setDeadline,
    deadline,
    setIsDeadlineVisible,
    setDeadlineDate,
    onPickDatePress
}: NotificationSelectorProps) {
    const theme = useContext(ThemeContext);

    const dates = [
        {
            id: "views.authenticated.home.text-input.deadline.today",
            icon: (<TodayLater />),
            value: notificationTimeNames.TODAY,
            isVisible: (deadline !== notificationTimeNames.TODAY),
            onPress: () => {
                setDeadline(notificationTimeNames.TODAY);
                const date: string | null = getFormattedDate(notificationTimeNames.TODAY);
                setDeadlineDate(date);
                setIsDeadlineVisible(false);
            }
        },
        {
            id: "views.authenticated.home.text-input.deadline.tomorrow",
            icon: (<Tomorrow />),
            value: notificationTimeNames.TOMORROW,
            isVisible: (deadline !== notificationTimeNames.TOMORROW),
            onPress: () => {
                setDeadline(notificationTimeNames.TOMORROW);
                const date: string | null = getFormattedDate(notificationTimeNames.TOMORROW);
                setDeadlineDate(date);
                setIsDeadlineVisible(false);
            }
        },
        {
            id: "views.authenticated.home.text-input.deadline.next-week",
            icon: (<NextWeek />),
            value: notificationTimeNames.NEXT_WEEK,
            isVisible: (deadline !== notificationTimeNames.NEXT_WEEK),
            onPress: () => {
                setDeadline(notificationTimeNames.NEXT_WEEK);
                const date: string | null = getFormattedDate(notificationTimeNames.NEXT_WEEK);
                setDeadlineDate(date);
                setIsDeadlineVisible(false);
            }
        },
        {
            id: "views.authenticated.home.text-input.deadline.pick-date",
            icon: (<PickTime />),
            value: notificationTimeNames.PICK_DATE,
            isVisible: (deadline !== notificationTimeNames.PICK_DATE),
            onPress: () => {
                onPickDatePress();
            }
        },
        {
            id: "views.authenticated.home.text-input.deadline.remove",
            icon: (<RemoveNotification />),
            value: notificationTimeNames.REMOVE,
            isVisible: (deadline !== notificationTimeNames.REMOVE),
            onPress: () => {
                setDeadline(notificationTimeNames.REMOVE);
                const date: string | null = getFormattedDate(notificationTimeNames.REMOVE);
                setDeadlineDate(date);
                setIsDeadlineVisible(false);
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
