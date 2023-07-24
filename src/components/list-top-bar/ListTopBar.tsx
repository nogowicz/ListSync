import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider'
import { constants, spacing, typography } from 'styles';
import { FormattedMessage } from 'react-intl';

import GoBack from 'assets/button-icons/Back.svg';
import Details from 'assets/button-icons/details.svg';

type ListTopBar = {
    name: string;
    icon: any;
};

export default function ListTopBar({ name, icon }: ListTopBar) {
    const theme = useContext(ThemeContext);
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <TouchableOpacity
                activeOpacity={0.5}
                style={{
                    borderWidth: 1,
                    borderRadius: constants.BORDER_RADIUS.BUTTON,
                    padding: spacing.SCALE_12,
                    borderColor: theme.LIGHT_HINT,
                }}
            >
                <GoBack />
            </TouchableOpacity>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.SCALE_20,
                justifyContent: 'center',
            }}>

                {icon}

                <Text style={{
                    fontSize: typography.FONT_SIZE_24,
                    color: theme.TEXT,
                }}>
                    {name}
                </Text>
            </View>
            <TouchableOpacity
                activeOpacity={0.5}
                style={{
                    padding: spacing.SCALE_12,
                }}>
                <Details />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({})