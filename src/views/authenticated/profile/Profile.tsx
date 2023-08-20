import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { constants, spacing } from 'styles';
import { useUser } from 'context/UserProvider';


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
                <View>
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

                    <View>
                        <Text>
                            {user?.firstName} {user?.lastName}
                        </Text>
                        <Text>
                            {user?.email}
                        </Text>
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
})