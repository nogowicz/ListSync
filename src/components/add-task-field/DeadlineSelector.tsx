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
import { useTheme } from 'navigation/utils/ThemeProvider';
import { FormattedMessage } from 'react-intl';
import { getFormattedDate } from 'utils/dateFormat';

//icons:
import TodayCalendar from 'assets/button-icons/calendar-today.svg';
import PickDateCalendar from 'assets/button-icons/calendar-pick-date.svg';
import TomorrowCalendar from 'assets/button-icons/calendar-tomorrow.svg';
import NextWeekCalendar from 'assets/button-icons/calendar-next-week.svg';
import CalendarRemove from 'assets/button-icons/calendar-none.svg';


export const deadlineNames = {
    TODAY: "Today",
    TOMORROW: "Tomorrow",
    NEXT_WEEK: "Next week",
    PICK_DATE: "Pick date",
    REMOVE: "Deadline",
}

type DeadLineSelectorProps = {
    setDeadline: Dispatch<SetStateAction<string>>;
    deadline: string;
    setIsDeadlineVisible: Dispatch<SetStateAction<boolean>>;
    setDeadlineDate: Dispatch<SetStateAction<string | null>>;
    onPickDatePress: any;
}


export default function DeadLineSelector({
    setDeadline,
    deadline,
    setIsDeadlineVisible,
    setDeadlineDate,
    onPickDatePress
}: DeadLineSelectorProps) {
    const theme = useTheme();

    const dates = [
        {
            id: "views.authenticated.home.text-input.deadline.today",
            icon: (<TodayCalendar />),
            value: deadlineNames.TODAY,
            isVisible: (deadline !== deadlineNames.TODAY),
            onPress: () => {
                setDeadline(deadlineNames.TODAY);
                const date: string | null = getFormattedDate(deadlineNames.TODAY);
                setDeadlineDate(date);
                setIsDeadlineVisible(false);
            }
        },
        {
            id: "views.authenticated.home.text-input.deadline.tomorrow",
            icon: (<TomorrowCalendar />),
            value: deadlineNames.TOMORROW,
            isVisible: (deadline !== deadlineNames.TOMORROW),
            onPress: () => {
                setDeadline(deadlineNames.TOMORROW);
                const date: string | null = getFormattedDate(deadlineNames.TOMORROW);
                setDeadlineDate(date);
                setIsDeadlineVisible(false);
            }
        },
        {
            id: "views.authenticated.home.text-input.deadline.next-week",
            icon: (<NextWeekCalendar />),
            value: deadlineNames.NEXT_WEEK,
            isVisible: (deadline !== deadlineNames.NEXT_WEEK),
            onPress: () => {
                setDeadline(deadlineNames.NEXT_WEEK);
                const date: string | null = getFormattedDate(deadlineNames.NEXT_WEEK);
                setDeadlineDate(date);
                setIsDeadlineVisible(false);
            }
        },
        {
            id: "views.authenticated.home.text-input.deadline.pick-date",
            icon: (<PickDateCalendar />),
            value: deadlineNames.PICK_DATE,
            isVisible: (deadline !== deadlineNames.PICK_DATE),
            onPress: () => {
                onPickDatePress();
            }
        },
        {
            id: "views.authenticated.home.text-input.deadline.remove",
            icon: (<CalendarRemove />),
            value: deadlineNames.REMOVE,
            isVisible: (deadline !== deadlineNames.REMOVE),
            onPress: () => {
                setDeadline(deadlineNames.REMOVE);
                const date: string | null = getFormattedDate(deadlineNames.REMOVE);
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
                                alignItems: 'center',
                                paddingHorizontal: spacing.SCALE_12,
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
