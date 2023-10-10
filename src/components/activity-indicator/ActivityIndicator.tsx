import { useTheme } from "navigation/utils/ThemeProvider";
import { useRef, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { Animated, Easing, View, Modal, Text, StyleSheet } from "react-native";
import { constants, spacing, typography } from "styles";

function CustomActivityIndicator() {
    const lowestScale = 0.4;
    const scaleAnim = useRef(new Animated.Value(lowestScale)).current;
    const theme = useTheme();

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(
                    scaleAnim,
                    {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.elastic(2),
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    scaleAnim,
                    {
                        toValue: lowestScale,
                        duration: 800,
                        easing: Easing.back(2),
                        useNativeDriver: true
                    }
                )
            ])
        ).start();
    }, [scaleAnim])

    return (
        <View style={styles.indicatorBox}>
            <Animated.View
                style={{
                    ...styles.indicator,
                    scaleX: scaleAnim,
                    scaleY: scaleAnim,
                    backgroundColor: theme.FIXED_COMPONENT_COLOR,
                }}>
            </Animated.View>
        </View>
    );
}

export default function ActivityIndicator() {
    return (
        <Modal transparent={true}>
            <View style={styles.indicatorWrapper}>
                <CustomActivityIndicator />
                <Text style={styles.indicatorText}>
                    <FormattedMessage
                        defaultMessage="Loading..."
                        id="views.unauthenticated.button.loading"
                    />
                </Text>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    indicatorBox: {
        width: constants.ICON_SIZE.ACTIVITY_INDICATOR,
        height: constants.ICON_SIZE.ACTIVITY_INDICATOR,
        justifyContent: 'center',
        alignItems: 'center'
    },
    indicator: {
        width: constants.ICON_SIZE.ACTIVITY_INDICATOR,
        height: constants.ICON_SIZE.ACTIVITY_INDICATOR,
        borderRadius: constants.BORDER_RADIUS.CIRCLE
    },
    indicatorText: {
        fontSize: typography.FONT_SIZE_18,
        marginTop: spacing.SCALE_12,
    },
    indicatorWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});