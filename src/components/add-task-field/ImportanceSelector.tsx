import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { cloneElement, useContext, Dispatch, SetStateAction, } from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import { FormattedMessage } from 'react-intl';
import { spacing, constants, typography } from 'styles';

import EmptyIcon from 'assets/button-icons/battery-empty.svg';
import LowIcon from 'assets/button-icons/battery-low.svg';
import MediumIcon from 'assets/button-icons/battery-medium.svg';
import HighIcon from 'assets/button-icons/battery-high.svg';
import RemoveIcon from 'assets/button-icons/battery-remove.svg';

export const importanceNames = {
    EMPTY: "Empty",
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    REMOVE: "Importance"
}

type ImportanceSelectorProps = {
    importance: string;
    setImportance: Dispatch<SetStateAction<string>>;
    setIsImportanceVisible: Dispatch<SetStateAction<boolean>>;
}

export default function ImportanceSelector({ importance, setImportance, setIsImportanceVisible }: ImportanceSelectorProps) {
    const theme = useContext(ThemeContext);

    const importanceArray = [
        {
            id: "views.authenticated.home.text-input.importance.empty",
            icon: <EmptyIcon />,
            value: importanceNames.EMPTY,
            isVisible: (importance !== importanceNames.EMPTY),
            onPress: () => {
                setImportance(importanceNames.EMPTY);
                setIsImportanceVisible(false);
            }
        },
        {
            id: "views.authenticated.home.text-input.importance.low",
            icon: <LowIcon />,
            value: importanceNames.LOW,
            isVisible: (importance !== importanceNames.LOW),
            onPress: () => {
                setImportance(importanceNames.LOW);
                setIsImportanceVisible(false);
            }
        },
        {
            id: "views.authenticated.home.text-input.importance.medium",
            icon: <MediumIcon />,
            value: importanceNames.MEDIUM,
            isVisible: (importance !== importanceNames.MEDIUM),
            onPress: () => {
                setImportance(importanceNames.MEDIUM);
                setIsImportanceVisible(false);
            }
        },
        {
            id: "views.authenticated.home.text-input.importance.high",
            icon: <HighIcon />,
            value: importanceNames.HIGH,
            isVisible: (importance !== importanceNames.HIGH),
            onPress: () => {
                setImportance(importanceNames.HIGH);
                setIsImportanceVisible(false);
            }
        },
        {
            id: "views.authenticated.home.text-input.importance.remove",
            icon: <RemoveIcon />,
            value: importanceNames.REMOVE,
            isVisible: (importance !== importanceNames.REMOVE),
            onPress: () => {
                setImportance(importanceNames.REMOVE);
                setIsImportanceVisible(false);
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
                {importanceArray.map((importanceItem) => (
                    importanceItem.isVisible && (
                        <TouchableOpacity
                            activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                            key={importanceItem.id}
                            style={{
                                alignItems: 'center',
                                paddingHorizontal: spacing.SCALE_12,
                                width: spacing.SCALE_85,
                                marginLeft: -spacing.SCALE_12,
                            }}
                            onPress={importanceItem.onPress}
                        >
                            {cloneElement(importanceItem.icon as JSX.Element, {
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
                                    id={importanceItem.id}
                                    defaultMessage={importanceItem.value}
                                />
                            </Text>
                        </TouchableOpacity>
                    )))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({})