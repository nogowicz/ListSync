import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, SetStateAction, Dispatch, cloneElement, useState, } from 'react'
import Button, { buttonTypes } from 'components/button';
import { FormattedMessage } from 'react-intl';
import { typography, spacing, constants } from 'styles';
import { Modal } from 'components/modal/Modal';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { useListContext } from 'context/DataProvider';
import { ListType } from 'data/types';
import { listColorTheme, listIconTheme } from 'styles/list-styles';
import { useNavigation } from '@react-navigation/native';

type ChangeListModalProps = {
    isModalVisible: boolean;
    listName: string;
    IdList: number;
    selectedColor: number;
    placeholderText: string;
    setSelectedIcon: Dispatch<SetStateAction<number>>;
    selectedIcon: number;
    setSelectedColor: Dispatch<SetStateAction<number>>;
    handleModal: () => void;
    isNewList: boolean;
};

export default function ChangeListModal({
    isModalVisible,
    listName,
    IdList,
    selectedColor,
    placeholderText,
    setSelectedIcon,
    selectedIcon,
    setSelectedColor,
    handleModal,
    isNewList,
}: ChangeListModalProps) {
    const theme = useTheme();
    const [newListName, setNewListName] = useState<string>(listName);
    const navigation = useNavigation();
    const { listData, updateListData } = useListContext();
    const [isNewListState, setIsNewListState] = useState(isNewList);

    const handleDeleteList = () => {
        const updatedNewListData: ListType[] = listData.filter((list) => list.IdList !== IdList);
        updateListData(() => updatedNewListData);
        navigation.goBack();
    };

    const handleUpdateList = (listId: number, listName: string, selectedIcon: number, selectedColor: number) => {
        setIsNewListState(false);
        updateListData((prevListData: ListType[]) => {
            const updatedLists = prevListData.map((list: ListType) => {
                if (list.IdList === listId) {
                    handleModal();
                    return {
                        ...list,
                        listName: listName,
                        iconId: selectedIcon,
                        colorVariant: selectedColor,
                    };
                } else {
                    return list;
                }
            });

            return updatedLists;
        });
    };

    const handleCancelPress = () => {
        if (isNewListState) {
            handleDeleteList();
        }
        handleModal();
    };



    return (
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
                        value={newListName}
                        onChangeText={(text) => setNewListName(text)}
                        underlineColorAndroid={listColorTheme[selectedColor]}
                        placeholder={placeholderText}
                        placeholderTextColor={theme.HINT}
                        style={{
                            color: theme.TEXT,
                            fontSize: typography.FONT_SIZE_16,
                            marginVertical: spacing.SCALE_12,
                        }}
                    />

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {Object.keys(listIconTheme).map((key) => {
                            const iconElement = listIconTheme[parseInt(key)];
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
                                        borderColor: selectedIcon === parseInt(key) ? listColorTheme[selectedColor] : theme.BACKGROUND,
                                    }}
                                >
                                    {cloneElement(iconElement as JSX.Element, { fill: listColorTheme[selectedColor] })}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {Object.keys(listColorTheme).map((key) => {
                            const colorElement = listColorTheme[parseInt(key)];
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
                                                width: constants.ICON_SIZE.COLOR_CIRCLE,
                                                height: constants.ICON_SIZE.COLOR_CIRCLE,
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
                        onPress={handleCancelPress}
                        type={buttonTypes.BUTTON_TYPES.FUNCTIONAL}
                    />

                    <Button text={
                        <FormattedMessage
                            defaultMessage='Save'
                            id='views.authenticated.home.list.modal.save'
                        />
                    }
                        onPress={() => handleUpdateList(IdList, newListName, selectedIcon, selectedColor)}
                        type={buttonTypes.BUTTON_TYPES.FUNCTIONAL}
                    />
                </Modal.Footer>
            </Modal.Container>
        </Modal>
    )
}
