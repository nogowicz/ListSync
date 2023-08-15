import { StyleSheet, Text, View, TextInput, InputModeOptions, } from 'react-native'
import React, { cloneElement, useContext, useState } from 'react'
import { constants, spacing, typography } from 'styles'
import { ThemeContext } from 'navigation/utils/ThemeProvider';
import Button from 'components/button/Button';
import { buttonTypes } from 'components/button';


type CustomTextFieldProps = {
    name: string;
    placeholder: string;
    icon: JSX.Element;
    inputMode: InputModeOptions;
    secureTextEntry?: boolean;
    isPasswordField?: boolean;
    isError?: boolean;
    errorMessage?: string;
};

export default function CustomTextField({
    name,
    placeholder,
    icon,
    inputMode,
    secureTextEntry = false,
    isPasswordField = false,
    isError = false,
    errorMessage = '',
}: CustomTextFieldProps) {
    const theme = useContext(ThemeContext);
    const [passwordVisibility, setPasswordVisibility] = useState(secureTextEntry);
    return (
        <View style={styles.root}>
            <Text
                style={[
                    styles.labelText,
                    {
                        color: isError ? theme.RED : theme.TEXT
                    }
                ]}
            >
                {name}
            </Text>
            <View
                style={[
                    styles.textFieldContainer,
                    isError && styles.textFieldWithError,
                    {
                        backgroundColor: isError ? theme.ERROR : theme.TERTIARY,
                    }
                ]}
            >
                {cloneElement(icon, {
                    stroke: theme.TEXT,
                    strokeWidth: constants.STROKE_WIDTH.ICON,
                    width: constants.ICON_SIZE.TEXT_FIELD_LIST_ICON,
                    height: constants.ICON_SIZE.TEXT_FIELD_LIST_ICON,
                })}
                <TextInput
                    style={[
                        styles.textInput,
                        {
                            color: theme.TEXT,
                        }
                    ]}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    placeholderTextColor={isError ? theme.LIGHT_HINT : theme.HINT}
                    secureTextEntry={passwordVisibility}
                />
                {isPasswordField ?
                    <Button
                        type={buttonTypes.BUTTON_TYPES.PASSWORD_VISIBILITY}
                        onPress={() => setPasswordVisibility(!passwordVisibility)}
                        secureTextEntry={passwordVisibility}
                    /> :
                    <View />
                }
            </View>
            {isError && <Text
                style={[
                    {
                        color: theme.RED,
                        marginLeft: spacing.SCALE_6,
                    }
                ]}
            >{errorMessage}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginVertical: spacing.SCALE_4,
    },
    textFieldContainer: {
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: spacing.SCALE_8,
        paddingHorizontal: spacing.SCALE_20,

    },
    textInput: {
        fontSize: typography.FONT_SIZE_16,
        marginHorizontal: spacing.SCALE_12,
        flex: 1,
    },
    labelText: {
        marginLeft: spacing.SCALE_8,
        fontSize: typography.FONT_SIZE_16,
    },
    textFieldWithError: {

    }
})