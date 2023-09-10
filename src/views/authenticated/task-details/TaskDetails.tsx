import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { spacing } from 'styles'
import { useTheme } from 'navigation/utils/ThemeProvider'
import NavigationTopBar, { navigationTypes } from 'components/navigation-top-bar';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'navigation/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIntl } from 'react-intl';
import Button, { buttonTypes } from 'components/button';
import { updateTaskInDatabase } from 'utils/database';
import { useNotification } from 'hooks/useNotification';
import { useListContext } from 'context/DataProvider';
import { ListType, TaskType } from 'data/types';


type TaskDetailsScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'TASK_DETAILS'>;
type TaskDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TASK_DETAILS'>;

type TaskDetailsProps = {
    navigation: TaskDetailsScreenNavigationProp['navigation'];
    route: TaskDetailsScreenRouteProp;
};



export default function TaskDetails({ navigation, route }: TaskDetailsProps) {
    const theme = useTheme();
    const intl = useIntl();
    const { task, color }: any = route.params;

    //translations:
    const editTaskTranslation = intl.formatMessage({
        defaultMessage: "Edit task",
        id: "vies.authenticated.task.details.edit-task"
    });



    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <NavigationTopBar
                    name={editTaskTranslation}
                    type={navigationTypes.NAVIGATION_TOP_BAR_TYPES.BASIC}
                />
                <View>
                    <Button
                        type={buttonTypes.BUTTON_TYPES.CHECK}
                        onPress={() => { }}
                        isChecked={task.isCompleted}
                        color={color}
                    />
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
    }

})