import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from 'navigation/utils/ThemeProvider'
import { typography, spacing } from 'styles';

export default function SignUpPanel() {
    const theme = useTheme();
    return (
        <View>
            <View style={styles.actionContainer}>
                <View style={styles.actionContainerComponent} >
                    {/* {action} */}
                </View>

                <View style={styles.actionContainerComponent} />
            </View>
            <View style={[styles.textContainer]}>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: theme.TERTIARY }]}>
                        {/* {title} */}
                    </Text>
                    <Text style={[styles.subTitle, { color: theme.TERTIARY }]}>
                        {/* {subTitle} */}
                    </Text>
                </View>
                <View style={styles.mainContent}>
                    {/* {mainContent} */}
                </View>
            </View>
            {/* {isKeyboardVisible ? null :
        <Pagination activePage={page} pages={pages} />} */}
        </View>
    )
}

const styles = StyleSheet.create({
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionContainerComponent: {
        flex: 1 / 5
    },
    textContainer: {
        justifyContent: 'center',
    },
    title: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_24,
        textAlign: 'center',
        marginTop: spacing.SCALE_4
    },
    subTitle: {
        ...typography.FONT_REGULAR,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        fontSize: typography.FONT_SIZE_12,
        textAlign: 'center',
    },
    mainContent: {
        marginBottom: spacing.SCALE_4,
    }
})