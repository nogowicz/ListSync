import { StyleSheet, Text, View } from 'react-native'
import React, { RefObject, useState } from 'react'
import { constants, spacing } from 'styles';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { BottomSheetRefProps } from 'components/bottom-sheet/BottomSheet';
import { useIntl } from 'react-intl';
import { ListType } from 'data/types';
import { useListContext } from 'context/DataProvider';
import { useNavigation } from '@react-navigation/native';

//icons:
import RemoveCompletedTasksIcon from 'assets/button-icons/remove-completed-tasks.svg';
import SortByIcon from 'assets/button-icons/sort-by.svg';
import ChangeThemeIcon from 'assets/button-icons/theme.svg';
import ShareIcon from 'assets/button-icons/share.svg';
import PeopleIcon from 'assets/button-icons/people.svg';
import DeleteIcon from 'assets/button-icons/trash.svg';

//components:
import BottomSheet from 'components/bottom-sheet';
import Button, { buttonTypes } from 'components/button';
import { deleteCompletedTasksInDatabase } from 'utils/database';

type BottomSheetWithSettingsProps = {
    refDetails: RefObject<BottomSheetRefProps>;
    IdList: number;
    handleModal: () => void;
    handleShowDetailsBottomSheet: () => void;
};

export default function BottomSheetWithSettings({
    refDetails,
    IdList,
    handleModal,
    handleShowDetailsBottomSheet,
}: BottomSheetWithSettingsProps) {
    const theme = useTheme();
    const intl = useIntl();
    const { listData, updateListData } = useListContext();
    const navigation = useNavigation();
    const [currentList, setCurrentList] = useState(listData.find((item: ListType) => item.IdList === IdList));

    //translations:
    const removeCompletedTasksTranslation = intl.formatMessage({
        defaultMessage: 'Remove completed tasks',
        id: 'views.authenticated.list.details.remove-completed-tasks'
    });
    const sortByTranslation = intl.formatMessage({
        defaultMessage: 'Sort by',
        id: 'views.authenticated.list.details.sort-by'
    });

    const editListTranslation = intl.formatMessage({
        defaultMessage: 'Edit list',
        id: 'views.authenticated.list.details.edit-list'
    });

    const shareTranslation = intl.formatMessage({
        defaultMessage: 'Share',
        id: 'views.authenticated.list.details.share'
    });

    const inviteFriendsTranslation = intl.formatMessage({
        defaultMessage: 'Invite friends',
        id: 'views.authenticated.list.details.invite-friends'
    });

    const deleteListTranslation = intl.formatMessage({
        defaultMessage: 'Delete list',
        id: 'views.authenticated.list.details.delete-list'
    });

    const handleDeleteList = () => {
        const updatedNewListData: ListType[] = listData.filter((list) => (list.IdList !== IdList && list.canBeDeleted));
        updateListData(() => updatedNewListData);
        navigation.goBack();
    };

    async function removeCompletedTasks() {
        handleShowDetailsBottomSheet();

        try {
            await deleteCompletedTasksInDatabase(IdList);

            const updatedListData = listData.map((list) => {
                if (list.IdList === IdList) {
                    const updatedTasks = list.tasks.filter((task) => !task.isCompleted);
                    return {
                        ...list,
                        tasks: updatedTasks,
                    };
                }
                return list;
            });

            updateListData(() => updatedListData);
        } catch (error) {
            console.error('Error removing completed tasks:', error);
        }
    }


    return (
        <BottomSheet
            ref={refDetails}
            height={constants.BOTTOM_SHEET_HEIGHT.DETAILS}
        >
            <View style={{
                marginHorizontal: spacing.SCALE_20,
                gap: spacing.SCALE_30,
            }}>
                <Button
                    text={removeCompletedTasksTranslation}
                    icon={<RemoveCompletedTasksIcon
                        stroke={theme.FIXED_DARK_TEXT}
                        strokeWidth={constants.STROKE_WIDTH.ICON}
                        height={constants.ICON_SIZE.SETTING_BUTTON}
                        width={constants.ICON_SIZE.SETTING_BUTTON}
                    />}
                    type={buttonTypes.BUTTON_TYPES.BOTTOM_SHEET_BUTTON}
                    color={theme.FIXED_DARK_TEXT}
                    onPress={removeCompletedTasks}
                />
                <Button
                    text={sortByTranslation}
                    icon={<SortByIcon
                        stroke={theme.FIXED_DARK_TEXT}
                        strokeWidth={constants.STROKE_WIDTH.ICON}
                        height={constants.ICON_SIZE.SETTING_BUTTON}
                        width={constants.ICON_SIZE.SETTING_BUTTON}
                    />}
                    type={buttonTypes.BUTTON_TYPES.BOTTOM_SHEET_BUTTON}
                    color={theme.FIXED_DARK_TEXT}
                    onPress={() => console.log("sort by tasks")}
                />
                <Button
                    text={editListTranslation}
                    icon={<ChangeThemeIcon
                        stroke={theme.FIXED_DARK_TEXT}
                        strokeWidth={constants.STROKE_WIDTH.ICON}
                        height={constants.ICON_SIZE.SETTING_BUTTON}
                        width={constants.ICON_SIZE.SETTING_BUTTON}
                    />}
                    type={buttonTypes.BUTTON_TYPES.BOTTOM_SHEET_BUTTON}
                    color={theme.FIXED_DARK_TEXT}
                    onPress={handleModal}
                />
                <Button
                    text={shareTranslation}
                    icon={<ShareIcon
                        stroke={theme.FIXED_DARK_TEXT}
                        strokeWidth={constants.STROKE_WIDTH.ICON}
                        height={constants.ICON_SIZE.SETTING_BUTTON}
                        width={constants.ICON_SIZE.SETTING_BUTTON}
                    />}
                    type={buttonTypes.BUTTON_TYPES.BOTTOM_SHEET_BUTTON}
                    color={theme.FIXED_DARK_TEXT}
                    onPress={() => console.log("share list")}
                />
                <Button
                    text={inviteFriendsTranslation}
                    icon={<PeopleIcon
                        stroke={theme.FIXED_DARK_TEXT}
                        strokeWidth={constants.STROKE_WIDTH.ICON}
                        height={constants.ICON_SIZE.SETTING_BUTTON}
                        width={constants.ICON_SIZE.SETTING_BUTTON}
                    />}
                    type={buttonTypes.BUTTON_TYPES.BOTTOM_SHEET_BUTTON}
                    isAvailable={currentList?.canBeDeleted}
                    color={theme.FIXED_DARK_TEXT}
                    onPress={() => console.log("Invite friends")}
                />
                <Button
                    text={deleteListTranslation}
                    icon={<DeleteIcon
                        stroke={theme.DARK_RED}
                        strokeWidth={constants.STROKE_WIDTH.ICON}
                        height={constants.ICON_SIZE.SETTING_BUTTON}
                        width={constants.ICON_SIZE.SETTING_BUTTON}
                    />}
                    type={buttonTypes.BUTTON_TYPES.BOTTOM_SHEET_BUTTON}
                    isAvailable={currentList?.canBeDeleted}
                    color={theme.DARK_RED}
                    onPress={() => handleDeleteList()}
                />
            </View>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({})