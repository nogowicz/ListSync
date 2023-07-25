import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native'
import React, { useContext } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { constants, spacing, typography } from 'styles';
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import ListTopBar from 'components/list-top-bar';
import ListIcon from 'assets/list-icons/list-icon.svg';


type ListScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'LIST'>;

type ListProps = {
    navigation: ListScreenNavigationProp['navigation']
}

export default function List({ navigation }: ListProps) {
    const theme = useContext(ThemeContext);
    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <ListTopBar
                    name='Wishlist'
                    icon={<ListIcon />}
                />
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
    }
})