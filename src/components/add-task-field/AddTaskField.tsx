import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    BackHandler,
} from 'react-native'
import React, {
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { ThemeContext } from 'navigation/utils/ThemeProvider'
import { constants, spacing } from 'styles';
import { useIntl } from 'react-intl';
import { ScrollView } from 'react-native-gesture-handler';
import { useListContext } from 'context/DataProvider';
import { ListType, TaskType } from 'data/types';
import { deadlineNames } from './DeadlineSelector';
import { getFormattedDate } from 'utils/dateFormat';
import Button, { buttonTypes } from 'components/button';
import { importanceNames } from './ImportanceSelector';
import { useNavigation } from '@react-navigation/native';
import DateTimePickers from './DateTimePickers';

//icons:
import AddTaskIcon from 'assets/button-icons/add-task.svg';
import Selectors from './Selectors';
import FunctionalPanel from './FunctionalPanel';


type AddTaskFieldProps = {
    currentListId: number;
}

export default function AddTaskField({ currentListId }: AddTaskFieldProps) {
    const navigation = useNavigation();
    const theme = useContext(ThemeContext);
    const intl = useIntl();
    const { listData, updateListData } = useListContext();
    const [isInputVisible, setIsInputVisible] = useState(false);
    const lists = listData.filter((item: ListType) => item.isArchived === false);
    const [list, setList] = useState<ListType[]>(lists);
    const [activeList, setActiveList] = useState(list.find((item: ListType) => item.IdList === currentListId));
    const [isListVisible, setIsListVisible] = useState(false);

    const [isDeadlineVisible, setIsDeadlineVisible] = useState(false);
    const [deadline, setDeadline] = useState<string>("Deadline");
    const [textValue, setTextValue] = useState('');
    const [deadlineDate, setDeadlineDate] = useState<string | null>(null);
    const [showDeadlineDatePicker, setShowDeadlineDatePicker] = useState(false);
    const [showNotificationDatePicker, setShowNotificationDatePicker] = useState(false);
    const [deadlineDatePickerDate, setDeadlineDatePickerDate] = useState<Date>();

    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [notification, setNotification] = useState<string>("Notification");
    const [notificationDatePickerDate, setNotificationDatePickerDate] = useState<Date>(new Date());
    const [showNotificationTimePicker, setShowNotificationTimePicker] = useState(false);
    const [notificationTime, setNotificationTime] = useState<Date>();
    const [notificationTodayHour, setNotificationTodayHour] = useState<string>('18:00');
    const [notificationTomorrowHour, setNotificationTomorrowHour] = useState<string>('18:00');
    const [datePickerDate, setDatePickerDate] = useState<Date>();
    const [timePickerTime, setTimePickerTime] = useState<Date>();

    const [isImportanceVisible, setIsImportanceVisible] = useState(false);
    const [importance, setImportance] = useState<string>(importanceNames.REMOVE);


    const placeholderText = intl.formatMessage({
        id: 'views.authenticated.home.text-input.placeholder',
        defaultMessage: 'Add new task',
    });

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        inputRef.current?.focus();

        const now = new Date();
        if (now.getHours() > 17 || (now.getHours() === 17 && now.getMinutes() > 50)) {
            setNotificationTodayHour('22:00');
        } else if (now.getHours() > 21 || (now.getHours() === 21 && now.getMinutes() > 50)) {
            setNotificationTodayHour('23:30');
        } else {
            setNotificationTodayHour('18:00');
        }

    }, []);

    // TODO: Temporary code
    const handleAddTask = () => {
        if (textValue.trim() === '') {
            return;
        }

        const newListData = listData.map((list) => {
            if (list.IdList === activeList?.IdList && activeList) {
                const newTask: TaskType = {
                    IdTask: activeList.tasks.length + 10,
                    title: textValue,
                    isCompleted: false,
                    addedBy: 'john',
                    assignedTo: null,
                    deadline: deadlineDate,
                    effort: '',
                    importance: importance,
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



    useEffect(() => {
        setDeadlineDate(getFormattedDate(deadlineNames.PICK_DATE, datePickerDate) as string);
    }, [datePickerDate]);


    BackHandler.addEventListener('hardwareBackPress', () => {
        if (isInputVisible) {
            setIsInputVisible(false);
            return true;
        } else {
            if (navigation.canGoBack()) {
                navigation.goBack();
                return true;
            }
            BackHandler.exitApp();
        }
    });

    if (isInputVisible) {
        return (
            <View>
                <DateTimePickers
                    deadlineDatePickerDate={deadlineDatePickerDate}
                    timePickerTime={timePickerTime}
                    notificationDatePickerDate={notificationDatePickerDate}
                    showDeadlineDatePicker={showDeadlineDatePicker}
                    showNotificationDatePicker={showNotificationDatePicker}
                    showNotificationTimePicker={showNotificationTimePicker}
                    setShowDeadlineDatePicker={setShowDeadlineDatePicker}
                    setDeadlineDatePickerDate={setDeadlineDatePickerDate}
                    setDeadline={setDeadline}
                    setShowNotificationTimePicker={setShowNotificationTimePicker}
                    setTimePickerTime={setTimePickerTime}
                    setNotificationTime={setNotificationTime}
                    setNotification={setNotification}
                    setShowNotificationDatePicker={setShowNotificationDatePicker}
                    setNotificationDatePickerDate={setNotificationDatePickerDate}
                />
                <View
                    style={[
                        styles.container,
                        {
                            borderColor: theme.HINT,
                            backgroundColor: theme.BACKGROUND,
                        }]}>

                    <Selectors
                        isListVisible={isListVisible}
                        list={list}
                        setActiveList={setActiveList}
                        setIsListVisible={setIsListVisible}
                        isDeadlineVisible={isDeadlineVisible}
                        deadline={deadline}
                        setDeadline={setDeadline}
                        setIsDeadlineVisible={setIsDeadlineVisible}
                        setDeadlineDate={setDeadlineDate}
                        isNotificationVisible={isNotificationVisible}
                        notification={notification}
                        setNotification={setNotification}
                        setIsNotificationVisible={setIsNotificationVisible}
                        setNotificationTime={setNotificationTime}
                        isImportanceVisible={isImportanceVisible}
                        importance={importance}
                        setImportance={setImportance}
                        setIsImportanceVisible={setIsImportanceVisible}
                        setShowDeadlineDatePicker={setShowDeadlineDatePicker}
                        setShowNotificationDatePicker={setShowNotificationDatePicker}
                        notificationTodayHour={notificationTodayHour}
                        notificationTomorrowHour={notificationTomorrowHour}
                    />

                    <View style={styles.functionPanel}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            keyboardShouldPersistTaps='always'
                        >
                            <FunctionalPanel
                                isListVisible={isListVisible}
                                setIsListVisible={setIsListVisible}
                                isDeadlineVisible={isDeadlineVisible}
                                setIsDeadlineVisible={setIsDeadlineVisible}
                                isNotificationVisible={isNotificationVisible}
                                setIsNotificationVisible={setIsNotificationVisible}
                                isImportanceVisible={isImportanceVisible}
                                setIsImportanceVisible={setIsImportanceVisible}
                                activeList={activeList}
                                deadline={deadline}
                                deadlineDate={deadlineDate}
                                notification={notification}
                                notificationTime={notificationTime}
                                importance={importance}
                            />
                        </ScrollView>
                        <Button
                            type={buttonTypes.BUTTON_TYPES.HIDE_INPUT}
                            onPress={() => setIsInputVisible(false)}
                        />

                    </View>
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

            </View >
        );
    } else {
        return (
            <Button
                type={buttonTypes.BUTTON_TYPES.FAB}
                onPress={() => setIsInputVisible(true)}
            />
        );
    }
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


    functionPanel: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
})