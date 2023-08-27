import React from 'react'
import { LANGUAGES_ENTRY, THEMES_ENTRY } from 'views/authenticated/profile/Profile';
import { radioButtonsType } from '.';
import { prepareRadioButtons } from 'components/navigation-top-bar/helpers';

type CustomRadioButtonsProps = {
    values: LANGUAGES_ENTRY[] | THEMES_ENTRY[];
    type: radioButtonsType.RADIO_BUTTONS_TYPE;
}

type RadioButtonElement = {
    type: radioButtonsType.RADIO_BUTTONS_TYPE;
    radioButton?: JSX.Element;
    radioButtonTypes?: JSX.Element;
};

export default function CustomRadioButton({ values, type }: CustomRadioButtonsProps) {
    const radioButtons = prepareRadioButtons({
        values: values,
    });

    function getRadioButtonById(radioButtonElements: RadioButtonElement[], type: radioButtonsType.RADIO_BUTTONS_TYPE) {
        return radioButtonElements.find(radioButton => radioButton.type === type);
    }

    const radioButton: RadioButtonElement = getRadioButtonById(radioButtons, type) as RadioButtonElement;

    return (
        <>
            {radioButton && radioButton.radioButton}
        </>
    );
};