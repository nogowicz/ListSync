import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { constants, spacing, typography } from 'styles';
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
import ChangeListModal from 'components/change-list-modal';
import { useListContext } from 'context/DataProvider';
import { listColorTheme, listIconTheme } from 'styles/list-styles';

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
    const [selectedIcon, setSelectedIcon] = useState(currentList?.iconId || 1);
    const [selectedColor, setSelectedColor] = useState(currentList?.colorVariant || 1);
    const [listName, setListName] = useState(currentList?.listName || '');
    const [IdList, setIdList] = useState(currentList?.IdList || 0);
    const [unCompletedTasks, setUnCompletedTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [isCompletedVisible, setIsCompletedVisible] = useState(false);
    const intl = useIntl();

    const handleModal = () => {
        setIsModalVisible(() => !isModalVisible);
        setKeyboardVisible(false);
    };

    const rotateAnimation = useSharedValue(isCompletedVisible ? -90 : -180);

    const rotateStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotateAnimation.value}deg` }],
        };
    });

    const handleArrowPress = () => {
        const targetRotation = isCompletedVisible ? -180 : -90;
        rotateAnimation.value = withTiming(targetRotation, {
            duration: 200,
            easing: Easing.ease,
        });
        setIsCompletedVisible(!isCompletedVisible);
    };

    useEffect(() => {
        setCurrentList(listData.find((item: ListType) => item.IdList === data.IdList));
    }, [listData, data.IdList]);

    useEffect(() => {
        setUnCompletedTasks(currentList?.tasks.filter((item: Task) => !item.isCompleted) || []);
        setCompletedTasks(currentList?.tasks.filter((item: Task) => item.isCompleted) || []);
        setListName(currentList?.listName || '');
    }, [currentList]);

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
        // TODO: Handle no data state
        return <View><Text>No data here</Text></View>;
    }

    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <ListTopBar
                    name={listName}
                    icon={listIconTheme[currentList.iconId]}
                    color={listColorTheme[currentList.colorVariant]}
                    onTitlePress={handleModal}
                />
                {unCompletedTasks.length > 0 &&
                    <Text style={[
                        styles.sectionTitle,
                        {
                            color: theme.TEXT,
                            marginBottom: spacing.SCALE_20,
                        }]}>
                        <FormattedMessage
                            defaultMessage="Tasks "
                            id="views.authenticated.home.list.tasks" />
                        - {unCompletedTasks.length}

                    </Text>}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: spacing.SCALE_20,
                    }}
                >
                    <View>
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
                                <TouchableOpacity
                                    activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                                    onPress={handleArrowPress}
                                    style={styles.completedButton}
                                >
                                    <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
                                        <FormattedMessage defaultMessage="Completed "
                                            id="views.authenticated.home.list.completed" />
                                        - {completedTasks.length}
                                    </Text>
                                    <Animated.View style={[rotateStyle]}>
                                        <Arrow
                                            width={constants.ICON_SIZE.COMPLETED_ARROW}
                                            height={constants.ICON_SIZE.COMPLETED_ARROW}
                                        />
                                    </Animated.View>
                                </TouchableOpacity>
                                {isCompletedVisible &&
                                    <TaskList
                                        tasks={completedTasks}
                                        listId={currentList.IdList}
                                    />}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
            {!isModalVisible && (
                <View>
                    {isKeyboardVisible ?
                        <AddTaskField
                            currentListId={currentList.IdList}
                        /> :
                        <Button
                            type={buttonTypes.BUTTON_TYPES.FAB}
                            onPress={() => setKeyboardVisible(true)}
                        />
                    }
                </View>
            )}

            <ChangeListModal
                handleModal={handleModal}
                isModalVisible={isModalVisible}
                listName={listName}
                IdList={IdList}
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
        flex: 1,
        flexDirection: 'row',
        gap: spacing.SCALE_8,
        alignItems: 'center',
        paddingVertical: spacing.SCALE_8,
    },
    noTasksMessage: {
        textAlign: 'center',
        fontSize: typography.FONT_SIZE_20,
        marginVertical: spacing.SCALE_8,
    }
});
