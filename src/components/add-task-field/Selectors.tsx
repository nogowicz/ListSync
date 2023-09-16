import { StyleSheet } from 'react-native'
import React, { Dispatch, SetStateAction, } from 'react'
import DeadLineSelector from './DeadlineSelector'
import NotificationSelector from './NotificationSelector'
import ImportanceSelector from './ImportanceSelector'
import ListSelector from './ListSelector'
import { ListType } from 'data/types'

type SelectorsProps = {
    isListVisible: boolean;
    list: ListType[];
    setActiveList: Dispatch<SetStateAction<ListType | undefined>>;
    setIsListVisible: Dispatch<SetStateAction<boolean>>;
    isDeadlineVisible: boolean;
    deadline: string;
    setDeadline: Dispatch<SetStateAction<string>>;
    setIsDeadlineVisible: Dispatch<SetStateAction<boolean>>;
    setDeadlineDate: Dispatch<SetStateAction<string | null>>;
    isNotificationVisible: boolean;
    notification: string;
    setNotification: Dispatch<SetStateAction<string>>;
    setIsNotificationVisible: Dispatch<SetStateAction<boolean>>;
    setNotificationTime: Dispatch<SetStateAction<Date | undefined>>;
    isImportanceVisible: boolean;
    importance: string;
    setImportance: Dispatch<SetStateAction<string>>;
    setIsImportanceVisible: Dispatch<SetStateAction<boolean>>;
    setShowDeadlineDatePicker: Dispatch<SetStateAction<boolean>>;
    setShowNotificationDatePicker: Dispatch<SetStateAction<boolean>>;
    notificationTodayHour: string;
    notificationTomorrowHour: string;
};

export default function Selectors({
    isListVisible,
    list,
    setActiveList,
    setIsListVisible,
    isDeadlineVisible,
    deadline,
    setDeadline,
    setIsDeadlineVisible,
    setDeadlineDate,
    isNotificationVisible,
    notification,
    setNotification,
    setIsNotificationVisible,
    setNotificationTime,
    isImportanceVisible,
    importance,
    setImportance,
    setIsImportanceVisible,
    setShowDeadlineDatePicker,
    setShowNotificationDatePicker,
    notificationTodayHour,
    notificationTomorrowHour
}: SelectorsProps) {

    const handlePickDate = () => {
        if (isDeadlineVisible) {
            setShowDeadlineDatePicker(true);
            setShowNotificationDatePicker(false);
        } else if (isNotificationVisible) {
            setShowNotificationDatePicker(true);
            setShowDeadlineDatePicker(false);
        }
    };

    return (
        <>
            {isListVisible &&
                <ListSelector
                    list={list}
                    setActiveList={setActiveList}
                    setIsListVisible={setIsListVisible}
                />
            }

            {isNotificationVisible &&
                <NotificationSelector
                    setNotification={setNotification}
                    notification={notification}
                    setIsNotificationVisible={setIsNotificationVisible}
                    setNotificationTime={setNotificationTime}
                    onPickDatePress={handlePickDate}
                    notificationTodayHour={notificationTodayHour}
                    notificationTomorrowHour={notificationTomorrowHour}
                />
            }

            {isDeadlineVisible &&
                <DeadLineSelector
                    setDeadline={setDeadline}
                    deadline={deadline}
                    setIsDeadlineVisible={setIsDeadlineVisible}
                    setDeadlineDate={setDeadlineDate}
                    onPickDatePress={handlePickDate}
                />
            }



            {isImportanceVisible &&
                <ImportanceSelector
                    importance={importance}
                    setImportance={setImportance}
                    setIsImportanceVisible={setIsImportanceVisible}
                />
            }
        </>
    )
}

const styles = StyleSheet.create({})