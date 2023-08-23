import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { ReactNode, forwardRef, useCallback, useContext, useImperativeHandle } from 'react'
import { constants, spacing } from 'styles'
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import
Animated,
{
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useTheme } from 'navigation/utils/ThemeProvider';

const {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH
} = Dimensions.get('window');

type BottomSheetProps = {
    children?: ReactNode;
    height?: number
};
export type BottomSheetRefProps = {
    scrollTo: (destination: number) => void;
    isActive: () => boolean;
};

const BottomSheet = forwardRef<BottomSheetRefProps, BottomSheetProps>(({ children, height = 50 }, ref) => {
    const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + height;
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const theme = useTheme();

    const isActive = useCallback(() => {
        return active.value;
    }, []);

    const scrollTo = useCallback((destination: number) => {
        "worklet";
        active.value = destination !== 0;
        translateY.value = withSpring(destination, { damping: 50 });
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [scrollTo, isActive]);

    const context = useSharedValue({ y: 0 });

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate(event => {
            translateY.value = event.translationY + context.value.y;
            translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
        })
        .onEnd(() => {
            if (translateY.value > -SCREEN_HEIGHT / 3) {
                scrollTo(0);
            } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
                scrollTo(MAX_TRANSLATE_Y);
            }
        });

    const rBottomSheetStyle = useAnimatedStyle(() => {
        const borderRadius = interpolate(
            translateY.value,
            [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
            [constants.BORDER_RADIUS.BUTTON, 5],
            Extrapolate.CLAMP
        );
        return {
            borderRadius,
            transform: [
                { translateY: translateY.value }
            ]
        }

    });


    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle, { backgroundColor: theme.BOTTOM_SHEET_BACKGROUND }]}>
                <View style={[styles.line, { backgroundColor: theme.FIXED_DARK_TEXT }]} />
                {children}
            </Animated.View>
        </GestureDetector>

    )
});

export default BottomSheet;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        position: 'absolute',
        top: SCREEN_HEIGHT,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
    },
    line: {
        width: 75,
        height: 4,
        alignSelf: 'center',
        marginVertical: spacing.SCALE_16,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
    }
})