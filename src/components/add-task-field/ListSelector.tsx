import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Dispatch, SetStateAction, cloneElement, useContext } from 'react'
import { List } from 'data/types';
import { spacing, constants, typography } from 'styles';
import { theme } from 'styles/colors';
import { listIconTheme, listColorTheme } from 'styles/list-styles';
import list from 'views/authenticated/list';
import { ThemeContext } from 'navigation/utils/ThemeProvider';

type ListSelectorProps = {
    list: List[];
    setIsListVisible: Dispatch<SetStateAction<boolean>>;
    setActiveList: Dispatch<SetStateAction<List | undefined>>;
}

export default function ListSelector({ list, setIsListVisible, setActiveList }: ListSelectorProps) {
    const theme = useContext(ThemeContext);
    return (
        <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            keyboardShouldPersistTaps='always'
        >
            <View style={{
                flexDirection: 'row',
                gap: spacing.SCALE_12,
                marginVertical: spacing.SCALE_12,
            }}>
                {list.map((item: List) => (
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        key={item.IdList}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            setActiveList(item);
                            setIsListVisible(false);
                        }}
                    >
                        {cloneElement(listIconTheme[item.iconId] as JSX.Element,
                            {
                                fill: listColorTheme[item.colorVariant],
                                width: constants.ICON_SIZE.TEXT_FIELD_LIST_ICON,
                                height: constants.ICON_SIZE.TEXT_FIELD_LIST_ICON,
                            })}
                        <Text style={{
                            color: theme.TEXT,
                            fontSize: typography.FONT_SIZE_12,
                        }}>
                            {item.listName}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({})