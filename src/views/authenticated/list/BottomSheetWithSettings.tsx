import { StyleSheet, View } from 'react-native'
import React, { RefObject, useEffect, useState } from 'react'
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
import FavoriteListIcon from 'assets/button-icons/favorite.svg';
import ArchiveIcon from 'assets/button-icons/archive.svg';
import UnarchiveIcon from 'assets/button-icons/unarchive.svg';

//components:
import BottomSheet from 'components/bottom-sheet';
import Button, { buttonTypes } from 'components/button';

type BottomSheetWithSettingsProps = {
    refDetails: RefObject<BottomSheetRefProps>;
    idList: number;
    handleModal: () => void;
    handleShowDetailsBottomSheet: () => void;
};

export default function BottomSheetWithSettings({
    refDetails,
    idList,
    handleModal,
    handleShowDetailsBottomSheet,
}: BottomSheetWithSettingsProps) {
    const theme = useTheme();
    const intl = useIntl();
    const { listData, updateList, deleteList, deleteCompletedTasks } = useListContext();
    const navigation = useNavigation();
    const [currentList, setCurrentList] = useState(listData.find((item: ListType) => item.idList === idList));

    useEffect(() => {
        setCurrentList(listData.find((item: ListType) => item.idList === idList));
    }, [listData]);

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

    const addToFavoritesTranslation = intl.formatMessage({
        defaultMessage: 'Add to favorites',
        id: 'views.authenticated.list.details.add-to-favorites'
    });

    const removeFromFavoritesTranslation = intl.formatMessage({
        defaultMessage: "Remove from favorites",
        id: 'views.authenticated.list.details.remove-from-favorites'
    });

    const archiveList = intl.formatMessage({
        defaultMessage: 'Archive list',
        id: 'views.authenticated.list.details.archive-list'
    });

    const unarchiveList = intl.formatMessage({
        defaultMessage: 'Unarchive list',
        id: 'views.authenticated.list.details.unarchive-list'
    });

    const handleDeleteList = async () => {
        await deleteList(idList).then(() => {
            navigation.goBack();
        })
    };


    async function removeCompletedTasks() {
        handleShowDetailsBottomSheet();
        deleteCompletedTasks(idList);

    }

    async function addListToFavoriteList() {
        if (currentList) {
            handleShowDetailsBottomSheet();
            const isCurrentlyFavorite = currentList.isFavorite;
            const setIsFavorite = !isCurrentlyFavorite;

            try {
                updateList(currentList.idList, undefined, undefined, undefined, undefined, undefined, setIsFavorite);
            } catch (error) {
                console.error('Error while updating list:', error);
            }
        }
    }

    function handleArchiveList() {
        if (currentList) {
            handleShowDetailsBottomSheet();
            const isCurrentlyArchived = currentList.isArchived;
            const setIsArchived = !isCurrentlyArchived;

            try {
                updateList(currentList.idList, undefined, undefined, undefined, undefined, undefined, undefined, setIsArchived);
            } catch (error) {
                console.error('Error while updating list:', error);
            }
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
                    text={currentList?.isFavorite ? removeFromFavoritesTranslation : addToFavoritesTranslation}
                    icon={<FavoriteListIcon
                        stroke={theme.FIXED_DARK_TEXT}
                        strokeWidth={constants.STROKE_WIDTH.ICON}
                        height={constants.ICON_SIZE.SETTING_BUTTON}
                        width={constants.ICON_SIZE.SETTING_BUTTON}
                    />}
                    type={buttonTypes.BUTTON_TYPES.BOTTOM_SHEET_BUTTON}
                    color={theme.FIXED_DARK_TEXT}
                    onPress={addListToFavoriteList}
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
                    text={currentList?.isArchived ? unarchiveList : archiveList}
                    icon={
                        currentList?.isArchived ?
                            <UnarchiveIcon
                                stroke={theme.FIXED_DARK_TEXT}
                                strokeWidth={constants.STROKE_WIDTH.ICON}
                                height={constants.ICON_SIZE.SETTING_BUTTON}
                                width={constants.ICON_SIZE.SETTING_BUTTON}
                            /> :
                            <ArchiveIcon
                                stroke={theme.FIXED_DARK_TEXT}
                                strokeWidth={constants.STROKE_WIDTH.ICON}
                                height={constants.ICON_SIZE.SETTING_BUTTON}
                                width={constants.ICON_SIZE.SETTING_BUTTON}
                            />
                    }
                    type={buttonTypes.BUTTON_TYPES.BOTTOM_SHEET_BUTTON}
                    isAvailable={currentList?.canBeDeleted}
                    color={theme.FIXED_DARK_TEXT}
                    onPress={handleArchiveList}
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