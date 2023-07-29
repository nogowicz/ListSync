import { ThemeContext } from "navigation/utils/ThemeProvider";
import React, { useContext, } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import RNModal from "react-native-modal";
import { constants, spacing, typography } from "styles";
import { theme } from "styles/colors";
type ModalProps = {
    isVisible: boolean;
    children: React.ReactNode;
    [x: string]: any;
};
export const Modal = ({
    isVisible = false,
    children,
    ...props
}: ModalProps) => {
    return (
        <RNModal
            backdropOpacity={constants.ACTIVE_OPACITY.LOW}
            isVisible={isVisible}
            animationInTiming={400}
            animationOutTiming={400}
            animationIn='fadeIn'
            animationOut='fadeOut'
            {...props}>
            {children}
        </RNModal>
    );
};

const ModalContainer = ({ children }: { children: React.ReactNode }) => {
    const theme = useContext(ThemeContext);
    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>{children}</View>
    );
};

const ModalHeader = ({ title }: { title: string | React.ReactNode }) => {
    const theme = useContext(ThemeContext);
    return (
        <View style={styles.header}>
            <Text style={[styles.text, { color: theme.TEXT }]}>{title}</Text>
        </View>
    );
};

const ModalBody = ({ children }: { children?: React.ReactNode }) => (
    <View style={styles.body}>{children}</View>
);

const ModalFooter = ({ children }: { children?: React.ReactNode }) => (
    <View style={styles.footer}>{children}</View>
);

const styles = StyleSheet.create({
    container: {
        borderRadius: constants.BORDER_RADIUS.BUTTON,
    },
    header: {
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        paddingTop: spacing.SCALE_12,
        textAlign: "center",
        fontSize: typography.FONT_SIZE_24,
    },
    body: {
        justifyContent: "center",
        paddingHorizontal: spacing.SCALE_16,
        minHeight: 100,
    },
    footer: {
        justifyContent: "flex-end",
        alignItems: "center",
        padding: spacing.SCALE_20,
        flexDirection: "row",
        gap: spacing.SCALE_20,
    },
});

Modal.Header = ModalHeader;
Modal.Container = ModalContainer;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;