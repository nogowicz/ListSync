import { StyleSheet, Text, View, TextInput, InputModeOptions, } from 'react-native'
import React, { cloneElement, useState } from 'react'
import { constants, spacing, typography } from 'styles'
import { useTheme } from 'navigation/utils/ThemeProvider';
import Button from 'components/button/Button';
import { buttonTypes } from 'components/button';
import { FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';


type CustomTextFieldProps = {
    name: string;
    placeholder: string;
    icon: JSX.Element;
    inputMode: InputModeOptions;
    secureTextEntry?: boolean;
    isPasswordField?: boolean;
    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
    onBlur?: () => void;
    onFocus?: () => void;
    onChangeText: (text: string) => void;
    value: string;
};

export default function CustomTextField({
    name,
    placeholder,
    icon,
    inputMode,
    secureTextEntry = false,
    isPasswordField = false,
    error,
    ...props
}: CustomTextFieldProps) {
    const theme = useTheme();
    const [passwordVisibility, setPasswordVisibility] = useState(secureTextEntry);
    return (
        <View style={styles.root}>
            <Text
                style={[
                    styles.labelText,
                    {
                        color: error ? theme.RED : theme.TEXT
                    }
                ]}
            >
                {name}
            </Text>
            <View
                style={[
                    styles.textFieldContainer,
                    error && styles.textFieldWithError,
                    {
                        backgroundColor: error ? theme.ERROR : theme.TERTIARY,
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
                    {...props}
                    style={[
                        styles.textInput,
                        {
                            color: theme.TEXT,
                        }
                    ]}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    placeholderTextColor={error ? theme.LIGHT_HINT : theme.HINT}
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
            {error && <Text
                style={[
                    {
                        color: theme.RED,
                        marginLeft: spacing.SCALE_6,
                    }
                ]}
            >{error.message?.toString()}</Text>}
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