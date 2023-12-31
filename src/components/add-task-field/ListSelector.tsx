import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Dispatch, SetStateAction, cloneElement } from 'react'
import { ListType } from 'data/types';
import { spacing, constants, typography } from 'styles';
import { listIconTheme, listColorTheme } from 'styles/list-styles';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { useIntl } from 'react-intl';

type ListSelectorProps = {
    list: ListType[];
    setIsListVisible: Dispatch<SetStateAction<boolean>>;
    setActiveList: Dispatch<SetStateAction<ListType | undefined>>;
}

export default function ListSelector({ list, setIsListVisible, setActiveList }: ListSelectorProps) {
    const theme = useTheme();
    const intl = useIntl();

    //translations:
    const allListTranslation = intl.formatMessage({
        defaultMessage: 'All',
        id: 'views.authenticated.home.text-input.list-name.all'
    });


    const unnamedListTranslation = intl.formatMessage({
        defaultMessage: "Unnamed list",
        id: "views.authenticated.home.text-input.list-name.unnamed-list"
    });




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
                {list.map((item: ListType) => (
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        key={item.idList}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: spacing.SCALE_70,
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
                            textAlign: 'center',
                        }}
                            ellipsizeMode='tail'
                            numberOfLines={2}
                        >
                            {item.listName === "All" ? allListTranslation :
                                item.listName === "Unnamed list" ? unnamedListTranslation : item.listName}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({})