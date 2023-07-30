import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Keyboard } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { colors, constants, spacing, typography } from 'styles';
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import ListTopBar from 'components/list-top-bar';
import { RouteProp } from '@react-navigation/native';
import TaskList from 'components/task-list';
import { FormattedMessage, useIntl } from 'react-intl';
import { Task, List as ListType } from 'data/types';
import Arrow from 'assets/button-icons/Back.svg';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import AddTaskField from 'components/add-task-field';
import Button, { buttonTypes } from 'components/button';
import ChangeListModal from 'components/change-list-modal/ChangeListModal';
import { color, icon } from 'components/list-item/ListItem';
import { useListContext } from 'context/DataProvider';

type ListScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'LIST'>;
type ListScreenRouteProp = RouteProp<RootStackParamList, 'LIST'>;

type ListProps = {
    navigation: ListScreenNavigationProp['navigation'];
    route: ListScreenRouteProp;
};

export default function List({ navigation, route }: ListProps) {
    const theme = useContext(ThemeContext);
    const { data }: any = route.params;
    const { listData } = useListContext();
    const [currentList, setCurrentList] = useState(listData.find((item: ListType) => item.IdList === data.IdList));
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(1);
    const [selectedColor, setSelectedColor] = useState(1);
    const [listName, setListName] = useState(currentList?.listName || '');
    const intl = useIntl();
    const handleModal = () => {
        setIsModalVisible(() => !isModalVisible);
        setKeyboardVisible(false);
    };
    const [unCompletedTasks, setUnCompletedTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [isCompletedVisible, setIsCompletedVisible] = useState(false);

    const rotateAnimation = useSharedValue(isCompletedVisible ? -90 : -180);

    const rotateStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotateAnimation.value}deg` }],
        };
    });

    useEffect(() => {
        setCurrentList(listData.find((item: ListType) => item.IdList === data.IdList));
    }, [listData, data.IdList]);

    useEffect(() => {
        setUnCompletedTasks(currentList?.tasks.filter((item: Task) => !item.isCompleted) || []);
        setCompletedTasks(currentList?.tasks.filter((item: Task) => item.isCompleted) || []);
    }, [currentList]);

    const handleArrowPress = () => {
        const targetRotation = isCompletedVisible ? -180 : -90;
        rotateAnimation.value = withTiming(targetRotation, {
            duration: 200,
            easing: Easing.ease,
        });
        setIsCompletedVisible(!isCompletedVisible);
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const placeholderText = intl.formatMessage({
        defaultMessage: 'Enter list name',
        id: 'views.authenticated.home.list.modal.placeholder',
    });

    if (!currentList) {
        // TODO: Obsłużyć brak danych
        return <View><Text>No data here</Text></View>;
    }

    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <ListTopBar name={listName} icon={icon[currentList.iconId]} color={color[currentList.colorVariant]} onTitlePress={handleModal} />
                {unCompletedTasks.length > 0 &&
                    <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
                        <FormattedMessage
                            defaultMessage="Tasks "
                            id="views.authenticated.home.list.tasks" />
                        - {unCompletedTasks.length}

                    </Text>}
                {unCompletedTasks.length > 0 ?
                    <TaskList
                        tasks={unCompletedTasks}
                        listId={currentList.IdList}
                    /> :
                    completedTasks.length > 0 ?
                        <View>
                            <Text style={[styles.noTasksMessage, { color: theme.TEXT }]}>
                                <FormattedMessage
                                    id='views.authenticated.home.list.tasks-done'
                                    defaultMessage='Congratulations! You have completed all the tasks excellently - well done!'
                                />
                            </Text>
                        </View> :
                        <View>
                            <Text style={[styles.noTasksMessage, { color: theme.TEXT }]}>
                                <FormattedMessage
                                    id='views.authenticated.home.list.no-tasks-here'
                                    defaultMessage='There are no tasks here yet'
                                />
                            </Text>
                            <Text style={[styles.noTasksMessage, { color: theme.HINT }]}>
                                <FormattedMessage
                                    id='views.authenticated.home.list.no-tasks.button'
                                    defaultMessage="You can add a new task using the '+' button."
                                />
                            </Text>
                        </View>

                }
                {completedTasks.length > 0 && (
                    <View>
                        <TouchableOpacity activeOpacity={constants.ACTIVE_OPACITY.HIGH} onPress={handleArrowPress} style={styles.completedButton}>
                            <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
                                <FormattedMessage defaultMessage="Completed "
                                    id="views.authenticated.home.list.completed" />
                                - {completedTasks.length}
                            </Text>
                            <Animated.View style={[rotateStyle]}>
                                <Arrow width={constants.ICON_SIZE.COMPLETED_ARROW} height={constants.ICON_SIZE.COMPLETED_ARROW} />
                            </Animated.View>
                        </TouchableOpacity>
                        {isCompletedVisible &&
                            <TaskList tasks={completedTasks} listId={currentList.IdList} />}
                    </View>
                )}
            </View>
            {!isModalVisible && (
                <View>
                    {isKeyboardVisible ? <AddTaskField /> : <Button type={buttonTypes.BUTTON_TYPES.FAB} onPress={() => setKeyboardVisible(true)} />}
                </View>
            )}

            <ChangeListModal
                handleModal={handleModal}
                isModalVisible={isModalVisible}
                listName={listName}
                placeholderText={placeholderText}
                selectedColor={selectedColor}
                selectedIcon={selectedIcon}
                setSelectedColor={setSelectedColor}
                setSelectedIcon={setSelectedIcon}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_20,
        paddingTop: spacing.SCALE_20,
    },
    container: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: typography.FONT_SIZE_16,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    completedButton: {
        flexDirection: 'row',
        gap: spacing.SCALE_8,
        alignItems: 'center',
        marginTop: spacing.SCALE_20,
    },
    noTasksMessage: {
        textAlign: 'center',
        fontSize: typography.FONT_SIZE_20,
        marginVertical: spacing.SCALE_8,
    }
});
