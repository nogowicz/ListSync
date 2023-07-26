import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native'
import React, { useContext } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { constants, spacing, typography } from 'styles';
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import ListTopBar from 'components/list-top-bar';
import { RouteProp, useRoute } from '@react-navigation/native';
import { icon } from 'components/list-item/ListItem';
import TaskList from 'components/task-list';
import { List as ListType } from 'data/types';


type ListScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'LIST'>;
type ListScreenRouteProp = RouteProp<RootStackParamList, 'LIST'>;


type ListProps = {
    navigation: ListScreenNavigationProp['navigation'];
    route: ListScreenRouteProp;
}


export default function List({ navigation, route }: ListProps) {
    const theme = useContext(ThemeContext);

    const { data }: any = route.params;


    if (!data) {
        //TODO
        return <Text>No data here</Text>;
    }
    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <ListTopBar
                    name={data.listName}
                    icon={icon[data.iconId]}
                />
                <TaskList tasks={data.tasks} />
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