import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Dispatch, SetStateAction, cloneElement, useContext } from 'react'
import { constants, spacing, typography } from 'styles';
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import { FormattedMessage } from 'react-intl';

import TodayCalendar from 'assets/button-icons/calendar-today.svg';
import PickDateCalendar from 'assets/button-icons/calendar-pick-date.svg';
import TomorrowCalendar from 'assets/button-icons/calendar-tomorrow.svg';
import NextWeekCalendar from 'assets/button-icons/calendar-next-weeksvg.svg';

type DeadLineSelectorProps = {
    setDeadline: Dispatch<SetStateAction<string>>;
    deadline: string | undefined;
    setIsDeadlineVisible: Dispatch<SetStateAction<boolean>>;
}

export default function DeadLineSelector({ setDeadline, deadline, setIsDeadlineVisible }: DeadLineSelectorProps) {
    const theme = useContext(ThemeContext);

    const dates = [
        {
            id: "views.authenticated.home.text-input.deadline.today",
            icon: (<TodayCalendar />),
            value: "Today",
        },
        {
            id: "views.authenticated.home.text-input.deadline.tomorrow",
            icon: (<TomorrowCalendar />),
            value: "Tomorrow",
        },
        {
            id: "views.authenticated.home.text-input.deadline.next-week",
            icon: (<NextWeekCalendar />),
            value: "Next week",
        },
        {
            id: "views.authenticated.home.text-input.deadline.pick-date",
            icon: (<PickDateCalendar />),
            value: "Pick date",
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
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        key={date.id}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: spacing.SCALE_85,
                            marginLeft: -spacing.SCALE_12,
                        }}
                        onPress={() => {
                            setDeadline(date.value);
                            setIsDeadlineVisible(false);
                        }}
                    >
                        {cloneElement(date.icon as JSX.Element, {
                            stroke: theme.TEXT,
                            width: constants.ICON_SIZE.TEXT_FIELD_LIST_ICON,
                            height: constants.ICON_SIZE.TEXT_FIELD_LIST_ICON,
                        })}
                        <Text style={{
                            color: theme.TEXT,
                            fontSize: typography.FONT_SIZE_12,
                            textAlign: 'center',

                        }}>
                            <FormattedMessage
                                id={date.id}
                                defaultMessage={date.value}
                            />
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({})