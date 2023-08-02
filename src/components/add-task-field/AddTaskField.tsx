import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { cloneElement, useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider'
import { constants, spacing, typography } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';

import AddTaskIcon from 'assets/button-icons/add-task.svg';
import ListSelection from 'assets/button-icons/list-input-selection.svg';
import CalendarSelection from 'assets/button-icons/calendar-input-selection.svg';
import ImportanceSelection from 'assets/button-icons/importance-input-selection.svg';
import { ScrollView } from 'react-native-gesture-handler';
import { useListContext } from 'context/DataProvider';
import { List, Task } from 'data/types';
import { listColorTheme, listIconTheme } from 'styles/list-styles';
import ListSelector from './ListSelector';
import DeadLineSelector from './DeadlineSelector';

type AddTaskFieldProps = {
    currentListId: number;
}

export default function AddTaskField({ currentListId }: AddTaskFieldProps) {
    const theme = useContext(ThemeContext);
    const intl = useIntl();
    const { listData, updateListData } = useListContext();
    const lists = listData.filter((item: List) => item.isArchived === false);
    const [list, setList] = useState<List[]>(lists);
    const [activeList, setActiveList] = useState(list.find((item: List) => item.IdList === currentListId));
    const [isListVisible, setIsListVisible] = useState(false);
    const [isDeadlineVisible, setIsDeadlineVisible] = useState(false);
    const [deadline, setDeadline] = useState<string>("Set deadline");
    const [textValue, setTextValue] = useState('');
    const placeholderText = intl.formatMessage({
        id: 'views.authenticated.home.text-input.placeholder',
        defaultMessage: 'Add new task',
    });

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleAddTask = () => {
        if (textValue.trim() === '') {
            return;
        }

        const newListData = listData.map((list) => {
            if (list.IdList === activeList?.IdList) {
                const newTask: Task = {
                    IdTask: activeList.tasks.length + 10,
                    title: textValue,
                    isCompleted: false,
                    addedBy: 'john',
                    assignedTo: null,
                    deadline: null,
                    effort: '',
                    importance: '',
                    note: '',
                    createdAt: new Date().toISOString(),
                    List_idList: activeList?.IdList,
                    subtasks: [],
                };
                return {
                    ...list,
                    tasks: [...list.tasks, newTask],
                };
            } else {
                return list;
            }
        });


        updateListData(() => newListData);


        setTextValue('');
    };


    return (
        <View
            style={[
                styles.container,
                {
                    borderColor: theme.HINT,
                    backgroundColor: theme.BACKGROUND,
                }]}>

            {isListVisible &&
                <ListSelector
                    list={list}
                    setActiveList={setActiveList}
                    setIsListVisible={setIsListVisible}
                />
            }

            {isDeadlineVisible &&
                <DeadLineSelector
                    setDeadline={setDeadline}
                    deadline={deadline}
                    setIsDeadlineVisible={setIsDeadlineVisible}
                />
            }

            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                keyboardShouldPersistTaps='always'
            >
                <View style={styles.upperContainer}>
                    <TouchableOpacity
                        style={styles.buttons}
                        onPress={() => {
                            setIsListVisible(!isListVisible)
                            setIsDeadlineVisible(false);
                        }}
                    >
                        <ListSelection
                            stroke={activeList?.IdList === 1 ? theme.HINT : theme.PRIMARY}
                            strokeWidth={constants.STROKE_WIDTH.ICON}
                        />
                        <Text style={{
                            color: activeList?.IdList === 1 ? theme.HINT : theme.PRIMARY,
                        }}>
                            {activeList?.listName === 'All' ?
                                <FormattedMessage
                                    id='views.authenticated.home.text-input.list-name.all'
                                    defaultMessage={'All'}
                                /> :
                                activeList?.listName
                            }
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttons}
                        onPress={() => {
                            setIsDeadlineVisible(!isDeadlineVisible)
                            setIsListVisible(false);
                        }}
                    >
                        <CalendarSelection
                            fill={deadline === 'Set deadline' ? theme.HINT : theme.PRIMARY}
                        />
                        <Text
                            style={{
                                color: deadline === 'Set deadline' ? theme.HINT : theme.PRIMARY,

                            }}>
                            {deadline === 'Set deadline' &&
                                <FormattedMessage
                                    id='views.authenticated.home.text-input.deadline.set'
                                    defaultMessage={deadline}
                                />
                            }
                            {deadline === 'Today' &&
                                <FormattedMessage
                                    id='views.authenticated.home.text-input.deadline.today'
                                    defaultMessage={deadline}
                                />}
                            {deadline === 'Tomorrow' &&
                                <FormattedMessage
                                    id='views.authenticated.home.text-input.deadline.tomorrow'
                                    defaultMessage={deadline}
                                />}
                            {deadline === 'Next week' &&
                                <FormattedMessage
                                    id='views.authenticated.home.text-input.deadline.next-week'
                                    defaultMessage={deadline}
                                />}
                            {deadline === 'Pick date' &&
                                <FormattedMessage
                                    id='views.authenticated.home.text-input.deadline.pick-date'
                                    defaultMessage={deadline}
                                />}

                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttons}>
                        <ImportanceSelection
                            stroke={theme.HINT}
                            strokeWidth={constants.STROKE_WIDTH.ICON}
                        />
                        <Text style={{ color: theme.HINT }}>
                            <FormattedMessage
                                id='views.authenticated.home.text-input.importance'
                                defaultMessage={'Importance'}
                            />
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={styles.bottomContainer}>
                <TextInput
                    ref={inputRef}
                    autoFocus={true}
                    placeholder={placeholderText}
                    placeholderTextColor={theme.HINT}
                    style={[styles.textInput, { color: theme.TEXT, }]}
                    value={textValue}
                    onChangeText={(text) => setTextValue(text)}
                />
                <TouchableOpacity
                    activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                    style={{
                        padding: spacing.SCALE_8,
                    }}
                    onPress={handleAddTask}
                >
                    <AddTaskIcon />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        marginBottom: spacing.SCALE_20,
        paddingHorizontal: spacing.SCALE_20,
        paddingVertical: spacing.SCALE_8,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    textInput: {
        maxWidth: '90%',
    },
    upperContainer: {
        flexDirection: 'row',
        gap: spacing.SCALE_20,
        alignItems: 'center',
        marginBottom: spacing.SCALE_8,
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.SCALE_8,
    }
})