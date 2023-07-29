import { StyleSheet, Text, View, TouchableOpacity, Keyboard, TextInput, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState, } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { colors, constants, spacing, typography } from 'styles';
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import ListTopBar from 'components/list-top-bar';
import { RouteProp } from '@react-navigation/native';
import TaskList from 'components/task-list';
import { FormattedMessage, useIntl } from 'react-intl';
import { Task } from 'data/types';

import Arrow from 'assets/button-icons/Back.svg';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import AddTaskField from 'components/add-task-field';
import Button, { buttonTypes } from 'components/button';
import { Modal } from 'components/modal/Modal';
import ChangeListModal from 'components/change-list-modal/ChangeListModal';
import { color, icon } from 'components/list-item/ListItem';


type ListScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'LIST'>;
type ListScreenRouteProp = RouteProp<RootStackParamList, 'LIST'>;


type ListProps = {
    navigation: ListScreenNavigationProp['navigation'];
    route: ListScreenRouteProp;
}




export default function List({ navigation, route }: ListProps) {
    const theme = useContext(ThemeContext);
    const { data }: any = route.params;
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(1);
    const [selectedColor, setSelectedColor] = useState(1);
    const [listName, setListName] = useState(data.listName);
    const intl = useIntl();

    const handleModal = () => {
        setIsModalVisible(() => !isModalVisible);
        setKeyboardVisible(false);
    }
    const [unCompletedTasks, setUnCompletedTasks] = useState(
        data.tasks.filter((item: Task) => !item.isCompleted)
    );
    const [completedTasks, setCompletedTasks] = useState(
        data.tasks.filter((item: Task) => item.isCompleted)
    );
    const [isCompletedVisible, setIsCompletedVisible] = useState(false);

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
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const placeholderText = intl.formatMessage({
        defaultMessage: 'Enter list name',
        id: 'views.authenticated.home.list.modal.placeholder'
    });


    if (!data) {
        //TODO
        return <Text>No data here</Text>;
    }
    console.log(selectedColor)
    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <ListTopBar
                    name={data.listName}
                    icon={icon[data.iconId]}
                    color={color[data.colorVariant]}
                    onTitlePress={handleModal}
                />
                <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
                    <FormattedMessage
                        defaultMessage="Tasks "
                        id='views.authenticated.home.list.tasks'
                    />
                    - {unCompletedTasks.length}
                </Text>
                <TaskList tasks={unCompletedTasks} />
                {completedTasks.length > 0 && (
                    <View>
                        <TouchableOpacity
                            activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                            onPress={handleArrowPress}
                            style={styles.completedButton}
                        >
                            <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
                                <FormattedMessage
                                    defaultMessage="Completed "
                                    id="views.authenticated.home.list.completed"
                                />
                                - {completedTasks.length}
                            </Text>
                            <Animated.View style={[rotateStyle]}>
                                <Arrow
                                    width={constants.ICON_SIZE.COMPLETED_ARROW}
                                    height={constants.ICON_SIZE.COMPLETED_ARROW}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                        {isCompletedVisible && <TaskList tasks={completedTasks} />}
                    </View>
                )}
            </View>
            {!isModalVisible &&
                <View>
                    {isKeyboardVisible ? <AddTaskField /> :
                        <View>
                            <Button
                                type={buttonTypes.BUTTON_TYPES.FAB}
                                onPress={() => setKeyboardVisible(true)}
                            />
                        </View>
                    }
                </View>}

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
    )
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
    }
})