import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { constants, spacing, typography } from 'styles';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { RouteProp } from '@react-navigation/native';
import { FormattedMessage, useIntl } from 'react-intl';
import { TaskType, ListType } from 'data/types';
import Arrow from 'assets/button-icons/Back.svg';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { useListContext } from 'context/DataProvider';
import { listColorTheme, listIconTheme } from 'styles/list-styles';
import { BottomSheetRefProps } from 'components/bottom-sheet/BottomSheet';
import { navigationTypes } from 'components/navigation-top-bar';

//components:
import TaskList from 'components/task-list';
import ChangeListModal from 'components/change-list-modal';
import NavigationTopBar from 'components/navigation-top-bar';
import AddTaskField from 'components/add-task-field';
import BottomSheetWithSettings from './BottomSheetWithSettings';


//images:
import OopsImage from 'assets/images/opps.svg';


type ListScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'LIST'>;
type ListScreenRouteProp = RouteProp<RootStackParamList, 'LIST'>;

type ListProps = {
    navigation: ListScreenNavigationProp['navigation'];
    route: ListScreenRouteProp;
};

export default function List({
    navigation,
    route,
}: ListProps) {
    const theme = useTheme();
    const {
        currentListId,
        isModalVisibleOnStart = false,
        isNewList = false,
    }: any = route.params;
    const { listData, createList } = useListContext();
    const [currentList, setCurrentList] = useState(listData.find((item: ListType) => item.idList === currentListId));
    const [isModalVisible, setIsModalVisible] = useState(isModalVisibleOnStart);
    const [selectedIcon, setSelectedIcon] = useState(currentList?.iconId || 0);
    const [selectedColor, setSelectedColor] = useState(currentList?.colorVariant || 0);
    const [listName, setListName] = useState(currentList?.listName || '');
    const [idList, setIdList] = useState(currentList?.idList || 0);
    const [unCompletedTasks, setUnCompletedTasks] = useState<TaskType[]>([]);
    const [completedTasks, setCompletedTasks] = useState<TaskType[]>([]);
    const [isCompletedVisible, setIsCompletedVisible] = useState(false);
    const intl = useIntl();

    const detailsSheetOpen = useRef(false);
    const refDetails = useRef<BottomSheetRefProps>(null);

    const { height } = useWindowDimensions();
    const handleShowDetailsBottomSheet = useCallback(() => {
        detailsSheetOpen.current = !detailsSheetOpen.current;
        if (!detailsSheetOpen.current) {
            refDetails.current?.scrollTo(0);
        } else {
            refDetails.current?.scrollTo(-(height - constants.BOTTOM_SHEET_HEIGHT.DETAILS));
        }
    }, []);


    const handleModal = () => {
        setIsModalVisible(() => !isModalVisible);
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

    useLayoutEffect(() => {
        setCurrentList(listData.find((item: ListType) => item.idList === currentListId));
    }, [listData, currentListId]);

    useLayoutEffect(() => {
        setUnCompletedTasks(currentList?.tasks.filter((item: TaskType) => !item.isCompleted) || []);
        setCompletedTasks(currentList?.tasks.filter((item: TaskType) => item.isCompleted) || []);
        setListName(currentList?.listName || '');
    }, [currentList]);

    useEffect(() => {
        if (!currentList) {
            setTimeout(() => {
                navigation.goBack();
            }, 500);
        }
    }, []);

    const placeholderText = intl.formatMessage({
        defaultMessage: 'Enter list name',
        id: 'views.authenticated.home.list.modal.placeholder',
    });

    if (!currentList) {
        // Handle no data state

        return (
            <View style={{
                ...styles.noDataStyle,
                backgroundColor: theme.BACKGROUND,
            }} >
                <Text style={{
                    ...styles.noDataStyleText,
                    color: theme.TEXT,
                }}>
                    Oops!
                </Text>
                <OopsImage />
                <Text style={{
                    ...styles.noDataStyleText,
                    color: theme.TEXT,
                }}>
                    Something went wrong
                </Text>
            </View>);
    }

    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <NavigationTopBar
                    name={listName}
                    icon={listIconTheme[currentList.iconId]}
                    color={listColorTheme[currentList.colorVariant]}
                    onTitlePress={handleModal}
                    type={navigationTypes.NAVIGATION_TOP_BAR_TYPES.LIST}
                    handleShowDetailsBottomSheet={handleShowDetailsBottomSheet}
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
                                listId={currentList.idList}
                                color={listColorTheme[currentList.colorVariant]}
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
                                            fill={theme.TEXT}
                                            width={constants.ICON_SIZE.COMPLETED_ARROW}
                                            height={constants.ICON_SIZE.COMPLETED_ARROW}
                                        />
                                    </Animated.View>
                                </TouchableOpacity>
                                {isCompletedVisible &&
                                    <TaskList
                                        tasks={completedTasks}
                                        listId={currentList.idList}
                                        color={listColorTheme[currentList.colorVariant]}
                                    />}
                            </View>
                        )}
                    </View>
                </ScrollView>
                {!(isModalVisible || currentList.isArchived) && (
                    <AddTaskField
                        currentListId={currentList.idList}
                        color={listColorTheme[currentList.colorVariant]}
                    />
                )}
            </View>

            <ChangeListModal
                handleModal={handleModal}
                isModalVisible={isModalVisible}
                listName={listName}
                idList={idList}
                placeholderText={placeholderText}
                selectedColor={selectedColor}
                selectedIcon={selectedIcon}
                setSelectedColor={setSelectedColor}
                setSelectedIcon={setSelectedIcon}
                isNewList={isNewList}
            />

            <BottomSheetWithSettings
                refDetails={refDetails}
                idList={idList}
                handleModal={handleModal}
                handleShowDetailsBottomSheet={handleShowDetailsBottomSheet}
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
    },
    noDataStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.SCALE_20,
    },
    noDataStyleText: {
        fontSize: typography.FONT_SIZE_28,
        textAlign: 'center',
        fontWeight: typography.FONT_WEIGHT_BOLD,
    }
});
