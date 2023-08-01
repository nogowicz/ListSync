import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { cloneElement, useContext, useState } from 'react'
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
    const [textValue, setTextValue] = useState('');
    const placeholderText = intl.formatMessage({
        id: 'views.authenticated.home.text-input.placeholder',
        defaultMessage: 'Add new task',
    });

    const handleAddTask = () => {
        if (textValue.trim() === '') {
            return;
        }

        const newListData = listData.map((list) => {
            if (list.IdList === activeList?.IdList) {
                const newTask: Task = {
                    IdTask: activeList.tasks.length + 1,
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
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    keyboardShouldPersistTaps='always'
                >
                    <View style={{
                        flexDirection: 'row',
                        gap: spacing.SCALE_12,
                        marginVertical: spacing.SCALE_12,
                    }}>
                        {list.map((item: List) => (
                            <TouchableOpacity
                                activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                                key={item.IdList}
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    setActiveList(item);
                                    setIsListVisible(false);
                                }}
                            >
                                {cloneElement(listIconTheme[item.iconId] as JSX.Element,
                                    {
                                        fill: listColorTheme[item.colorVariant],
                                        width: constants.ICON_SIZE.TEXT_FIELD_LIST_ICON,
                                        height: constants.ICON_SIZE.TEXT_FIELD_LIST_ICON,
                                    })}
                                <Text style={{
                                    color: theme.TEXT,
                                    fontSize: typography.FONT_SIZE_12,
                                }}>
                                    {item.listName}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            }
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                keyboardShouldPersistTaps='always'
            >
                <View style={styles.upperContainer}>
                    <TouchableOpacity
                        style={styles.buttons}
                        onPress={() => setIsListVisible(!isListVisible)}
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
                    <TouchableOpacity style={styles.buttons}>
                        <CalendarSelection fill={theme.HINT} />
                        <Text style={{ color: theme.HINT }}>
                            <FormattedMessage
                                id='views.authenticated.home.text-input.deadline.today'
                                defaultMessage={'Today'}
                            />
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
                    placeholder={placeholderText}
                    placeholderTextColor={theme.HINT}
                    style={[styles.textInput, { color: theme.TEXT, }]}
                    autoFocus={true}
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