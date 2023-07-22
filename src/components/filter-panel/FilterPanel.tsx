import { StyleSheet, ScrollView, View, } from 'react-native'
import React, { useContext } from 'react'
import Button from 'components/button'
import { FormattedMessage } from 'react-intl'
import { spacing } from 'styles'
import { ThemeContext } from 'navigation/utils/ThemeProvider'

export default function FilterPanel() {
    const theme = useContext(ThemeContext);
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                <Button
                    type='filter'
                    isActive={true}
                    onPress={() => console.log("Filter button")}
                    text={
                        <FormattedMessage
                            id='views.authenticated.home.filter-button-text-all'
                            defaultMessage={'All'}
                        />
                    }
                    amount={13}
                />

                <View style={[styles.separator, { backgroundColor: theme.LIGHT_HINT }]} />

                <Button
                    type='filter'
                    isActive={false}
                    onPress={() => console.log("Filter button")}
                    text={
                        <FormattedMessage
                            id='views.authenticated.home.filter-button-text-favorite'
                            defaultMessage={'Favorite'}
                        />
                    }
                    amount={4}
                />
                <Button
                    type='filter'
                    isActive={false}
                    onPress={() => console.log("Filter button")}
                    text={
                        <FormattedMessage
                            defaultMessage={'Shared'}
                            id='views.authenticated.home.filter-button-text-shared'
                        />
                    }
                    amount={1}
                />
                <Button
                    type='filter'
                    isActive={false}
                    onPress={() => console.log("Filter button")}
                    text={
                        <FormattedMessage
                            id='views.authenticated.home.filter-button-text-archived'
                            defaultMessage={'Archived'}
                        />
                    }
                    amount={4}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.SCALE_20,
    },
    separator: {
        height: spacing.SCALE_20,
        width: spacing.SCALE_2,
        marginRight: spacing.SCALE_12,
        alignSelf: 'center',
    }
})