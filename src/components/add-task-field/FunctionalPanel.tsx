import { StyleSheet, View } from 'react-native'
import React, { Dispatch, SetStateAction, } from 'react'
import { spacing } from 'styles'
import FunctionPanelButtons, { FUNCTIONAL_BUTTONS_NAMES } from './FunctionPanelButtons'
import { ListType } from 'data/types'

type FunctionalPanelProps = {
    isListVisible: boolean,
    setIsListVisible: Dispatch<SetStateAction<boolean>>;
    setIsDeadlineVisible: Dispatch<SetStateAction<boolean>>;
    setIsNotificationVisible: Dispatch<SetStateAction<boolean>>;
    setIsImportanceVisible: Dispatch<SetStateAction<boolean>>;
    activeList: ListType | undefined;
    deadline: string;
    deadlineDate: string | null;
    notification: string;
    notificationTime: Date | undefined;
    importance: string;
    isDeadlineVisible: boolean;
    isNotificationVisible: boolean;
    isImportanceVisible: boolean;
}

export default function FunctionalPanel({
    isListVisible,
    setIsListVisible,
    setIsDeadlineVisible,
    setIsNotificationVisible,
    setIsImportanceVisible,
    activeList,
    deadline,
    deadlineDate,
    notification,
    notificationTime,
    importance,
    isDeadlineVisible,
    isNotificationVisible,
    isImportanceVisible,
}: FunctionalPanelProps) {
    return (
        <View style={styles.upperContainer}>
            <FunctionPanelButtons
                isListVisible={isListVisible}
                setIsListVisible={setIsListVisible}
                setIsDeadlineVisible={setIsDeadlineVisible}
                setIsNotificationVisible={setIsNotificationVisible}
                setIsImportanceVisible={setIsImportanceVisible}
                type={FUNCTIONAL_BUTTONS_NAMES.LIST}
                activeList={activeList}
            />

            <FunctionPanelButtons
                isNotificationVisible={isNotificationVisible}
                setIsListVisible={setIsListVisible}
                setIsDeadlineVisible={setIsDeadlineVisible}
                setIsNotificationVisible={setIsNotificationVisible}
                setIsImportanceVisible={setIsImportanceVisible}
                type={FUNCTIONAL_BUTTONS_NAMES.NOTIFICATION}
                notification={notification}
                notificationTime={notificationTime}
            />
            <FunctionPanelButtons
                isDeadlineVisible={isDeadlineVisible}
                setIsListVisible={setIsListVisible}
                setIsDeadlineVisible={setIsDeadlineVisible}
                setIsNotificationVisible={setIsNotificationVisible}
                setIsImportanceVisible={setIsImportanceVisible}
                type={FUNCTIONAL_BUTTONS_NAMES.DEADLINE}
                deadline={deadline}
                deadlineDate={deadlineDate}
            />



            <FunctionPanelButtons
                isImportanceVisible={isImportanceVisible}
                setIsListVisible={setIsListVisible}
                setIsDeadlineVisible={setIsDeadlineVisible}
                setIsNotificationVisible={setIsNotificationVisible}
                setIsImportanceVisible={setIsImportanceVisible}
                type={FUNCTIONAL_BUTTONS_NAMES.IMPORTANCE}
                importance={importance}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    upperContainer: {
        flexDirection: 'row',
        gap: spacing.SCALE_20,
        alignItems: 'center',
        marginBottom: spacing.SCALE_8,
    },
})