import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { constants, spacing, typography } from 'styles';
import { useUser } from 'context/UserProvider';
import { FormattedMessage } from 'react-intl';


type ProfilePropsNavigationProp = NativeStackScreenProps<RootStackParamList, 'PROFILE'>;

type ProfileProps = {
    navigation: ProfilePropsNavigationProp['navigation'];
};


export default function Profile({ navigation }: ProfileProps) {
    const theme = useTheme();
    const { user, setUserDetails } = useUser();
    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
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
                                    id='views.authenticated.settings.edit-profile'
                                    defaultMessage='Edit profile'
                                />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        marginHorizontal: spacing.SCALE_20,
        marginTop: spacing.SCALE_20,
        flex: 1,
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
})