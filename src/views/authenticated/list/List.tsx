import { StyleSheet, Text, View, TouchableOpacity, Keyboard, TextInput, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState, } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { colors, constants, spacing, typography } from 'styles';
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import ListTopBar from 'components/list-top-bar';
import { RouteProp } from '@react-navigation/native';
import { color, icon } from 'components/list-item/ListItem';
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
    const intl = useIntl();
    const handleModal = () => {
        setIsModalVisible(() => !isModalVisible);
        setKeyboardVisible(false);
    }
    const [listName, setListName] = useState(data.listName);
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

            <Modal isVisible={isModalVisible}>
                <Modal.Container>
                    <Modal.Header title={
                        <FormattedMessage
                            defaultMessage='Change list name'
                            id='views.authenticated.home.list.modal.title'
                        />
                    } />
                    <Modal.Body>
                        <TextInput
                            defaultValue={listName}
                            underlineColorAndroid={color[selectedColor]}
                            placeholder={placeholderText}
                            placeholderTextColor={theme.HINT}
                            style={{
                                color: theme.TEXT,
                                fontSize: typography.FONT_SIZE_16,
                                marginVertical: spacing.SCALE_12,
                            }}
                        />

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {Object.keys(icon).map((key) => {
                                const iconElement = icon[parseInt(key, 10)];
                                return (
                                    <TouchableOpacity
                                        key={key}
                                        onPress={() => setSelectedIcon(parseInt(key))}
                                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                                        style={{
                                            marginVertical: spacing.SCALE_12,
                                            marginRight: spacing.SCALE_8,
                                            borderWidth: 2,
                                            borderRadius: constants.BORDER_RADIUS.BUTTON,
                                            borderColor: selectedIcon === parseInt(key) ? color[selectedColor] : theme.BACKGROUND,
                                        }}
                                    >
                                        {iconElement}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {Object.keys(color).map((key) => {
                                const colorElement = color[parseInt(key, 10)];
                                return (
                                    <TouchableOpacity
                                        onPress={() => setSelectedColor(parseInt(key))}
                                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                                        key={key}
                                        style={{
                                            marginVertical: spacing.SCALE_12,
                                            marginRight: spacing.SCALE_8,
                                            width: constants.ICON_SIZE.COLOR,
                                            height: constants.ICON_SIZE.COLOR,
                                            backgroundColor: colorElement,
                                            borderRadius: constants.BORDER_RADIUS.BUTTON,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {selectedColor === parseInt(key) &&
                                            <View
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    backgroundColor: theme.BACKGROUND,
                                                    borderRadius: constants.BORDER_RADIUS.BUTTON,

                                                }}
                                            />}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button text={
                            <FormattedMessage
                                defaultMessage='Cancel'
                                id='views.authenticated.home.list.modal.cancel'
                            />
                        }
                            onPress={handleModal}
                            type={buttonTypes.BUTTON_TYPES.FUNCTIONAL}
                        />

                        <Button text={
                            <FormattedMessage
                                defaultMessage='Save'
                                id='views.authenticated.home.list.modal.save'
                            />
                        }
                            onPress={handleModal}
                            type={buttonTypes.BUTTON_TYPES.FUNCTIONAL}
                        />
                    </Modal.Footer>
                </Modal.Container>
            </Modal>

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