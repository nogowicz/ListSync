import React, { ReactNode } from 'react'
import { constants } from 'styles';
import { buttonTypes } from '.';
import { prepareButtons } from './helpers';

export const backButtonWidth = 46.90909194946289;

type ButtonElement = {
    type: buttonTypes.BUTTON_TYPES;
    button?: JSX.Element;
    buttonTypes?: JSX.Element;
};


type ButtonProps = {
    text?: string | ReactNode;
    type: buttonTypes.BUTTON_TYPES;
    amount?: number;
    isActive?: boolean;
    onPress: () => void;
    isChecked?: boolean;
    color?: string;
    activeOpacity?: number;
    secureTextEntry?: boolean;
    icon?: JSX.Element;
    isAvailable?: boolean;
};

export default function Button({
    text,
    type,
    amount,
    onPress,
    isChecked,
    color,
    isActive = false,
    activeOpacity = constants.ACTIVE_OPACITY.HIGH,
    secureTextEntry = false,
    icon,
    isAvailable = true
}: ButtonProps) {
    const buttonElement = prepareButtons({
        onPress: onPress,
        text: text,
        activeOpacity: activeOpacity,
        amount: amount,
        isActive: isActive,
        color: color,
        isChecked: isChecked,
        secureTextEntry: secureTextEntry,
        icon: icon,
        isAvailable: isAvailable
    });

    function getButtonById(buttonElements: ButtonElement[], type: buttonTypes.BUTTON_TYPES) {
        return buttonElements.find(button => button.type === type);
    }



    const button: ButtonElement = getButtonById(buttonElement, type) as ButtonElement;


    return (
        <>
            {button && button.button}
        </>
    );
}

