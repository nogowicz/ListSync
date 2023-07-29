import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, SetStateAction, Dispatch, cloneElement } from 'react'
import Button, { buttonTypes } from 'components/button';
import { color, icon } from 'components/list-item/ListItem';
import { FormattedMessage } from 'react-intl';
import { typography, spacing, constants } from 'styles';
import { Modal } from 'components/modal/Modal';
import { ThemeContext } from 'navigation/utils/ThemeProvider';

type ChangeListModalProps = {
    isModalVisible: boolean;
    listName: string;
    selectedColor: number;
    placeholderText: string;
    setSelectedIcon: Dispatch<SetStateAction<number>>;
    selectedIcon: number;
    setSelectedColor: Dispatch<SetStateAction<number>>;
    handleModal: () => void;
};

export default function ChangeListModal({
    isModalVisible,
    listName,
    selectedColor,
    placeholderText,
    setSelectedIcon,
    selectedIcon,
    setSelectedColor,
    handleModal,
}: ChangeListModalProps) {
    const theme = useContext(ThemeContext);
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
                            const iconElement = icon[parseInt(key)];
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
                                    {cloneElement(iconElement as any, { fill: color[selectedColor] })}
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
    )
}

const styles = StyleSheet.create({})