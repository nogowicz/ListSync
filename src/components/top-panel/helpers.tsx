import { useTheme } from "navigation/utils/ThemeProvider";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { typography, constants, spacing } from "styles";
import { topPanelTypes } from ".";
import Button, { buttonTypes } from "components/button";
import { SCREENS } from "navigation/utils/screens";
import { FormattedMessage, useIntl } from "react-intl";
import { formatDateToLongDate } from "utils/dateFormat";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "context/UserProvider";

export function prepareTopPanel() {
    const intl = useIntl();
    const date = formatDateToLongDate(new Date(), intl);
    const theme = useTheme();
    const navigation = useNavigation();
    const { user } = useUser();



    return [
        {
            type: topPanelTypes.TOP_PANEL_TYPES.HOME_SCREEN,
            topPanel: (
                <View style={styles.container}>
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        onPress={() => navigation.navigate(SCREENS.AUTHENTICATED.PROFILE.ID as never)}
                    >
                        <Text style={[styles.greetingText, { color: theme.TEXT }]}>
                            <FormattedMessage
                                id='views.authenticated.home.greetings-text'
                                defaultMessage={"Hi, "}
                            />
                            {user?.firstName}!
                        </Text>
                        <Text style={[styles.dateText, { color: theme.HINT }]}>{date}</Text>
                    </TouchableOpacity>
                    <Button
                        onPress={() => console.log("New list button")}
                        text={
                            <FormattedMessage
                                id='views.authenticated.home.add-button-text'
                                defaultMessage={"New List"}
                            />
                        } type={buttonTypes.BUTTON_TYPES.ADD} />
                </View>
            )
        },
        {
            type: topPanelTypes.TOP_PANEL_TYPES.PROFILE_SCREEN,
            topPanel: (
                <View style={styles.userDataContainer}>
                    {user?.photoURL ?
                        <Image
                            source={{ uri: user?.photoURL }}
                            style={styles.profileImage}
                        />
                        :
                        <Image
                            source={require('assets/images/profile_base_image.png')}
                            style={styles.profileImage}
                        />
                    }

                    <View style={styles.profileDataTextContainer}>
                        <Text style={[styles.namesText, { color: theme.TEXT, }]}>
                            {user?.firstName} {user?.lastName}
                        </Text>
                        <Text style={[styles.emailText, { color: theme.TEXT }]}>
                            {user?.email}
                        </Text>
                        <TouchableOpacity
                            activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                            onPress={() => console.log("Navigating to edit profile screen")}
                        >
                            <Text style={[styles.editText, { color: theme.PRIMARY }]}>
                                <FormattedMessage
                                    id='views.authenticated.profile.edit-profile'
                                    defaultMessage='Edit profile'
                                />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    ];
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    greetingText: {
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        fontSize: typography.FONT_SIZE_24,
    },
    dateText: {
        fontSize: typography.FONT_SIZE_15,
    },
    profileImage: {
        width: constants.PHOTO_SIZE.BIG,
        height: constants.PHOTO_SIZE.BIG,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
    },
    userDataContainer: {
        flexDirection: 'row',
        gap: spacing.SCALE_20,
    },
    namesText: {
        fontSize: typography.FONT_SIZE_20,
    },
    emailText: {
        fontSize: typography.FONT_SIZE_16,
    },
    editText: {
        fontSize: typography.FONT_SIZE_18,
    },
    profileDataTextContainer: {
        justifyContent: 'space-between',
    }
});