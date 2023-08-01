import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { cloneElement, useContext } from 'react'
import { List } from 'data/types';
import { constants, spacing, typography } from 'styles';
import { ThemeContext } from 'navigation/utils/ThemeProvider';

import TodayCalendar from 'assets/button-icons/calendar-today.svg';
import PickDateCalendar from 'assets/button-icons/calendar-pick-date.svg';
import { FormattedMessage } from 'react-intl';

type DeadLineSelectorProps = {

}

export default function DeadLineSelector({ }: DeadLineSelectorProps) {
    const theme = useContext(ThemeContext);

    const dateIcons = {
        "views.authenticated.home.text-input.deadline.today": (<TodayCalendar />),
        "views.authenticated.home.text-input.deadline.tomorrow": (<TodayCalendar />),
        "views.authenticated.home.text-input.deadline.next-week": (<TodayCalendar />),
        "views.authenticated.home.text-input.deadline.pick-date": (<PickDateCalendar />),
    }

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
                {Object.keys(dateIcons).map((key) => (
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        key={key}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: spacing.SCALE_85,
                            marginLeft: -spacing.SCALE_12,
                        }}
                    >
                        {cloneElement(dateIcons[key as keyof typeof dateIcons] as JSX.Element, {
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
                                id={key}
                                defaultMessage="Today"
                            />
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({})