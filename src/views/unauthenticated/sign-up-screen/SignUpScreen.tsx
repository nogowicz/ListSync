import { StyleSheet, View } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/navigation';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { spacing, typography } from 'styles';
import { prepareSignUpPages } from './helpers';


//icons:
import SignUpPanel from './sign-up-panel';

type SignUpPageType = {
    id: string;
    topContainer: JSX.Element;
    subTitle: JSX.Element;
    mainContent: JSX.Element;
    buttonLabel: string;
    buttonAction: Dispatch<SetStateAction<number>> | any;
};

export type SignUpPagesArrayType = SignUpPageType[];

export type SignUpScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SIGN_UP_SCREEN'>;

type SignUpScreenProps = {
    navigation: SignUpScreenNavigationProp['navigation'];
};


export default function SignUpScreen({ navigation }: SignUpScreenProps) {
    const theme = useTheme();
    const [page, setPage] = useState<number>(0);

    //animations
    const animationDuration = 200;


    function handleNextPage() {
        setPage(prevPage => prevPage + 1);
    }
    function handleBack() {
        setPage(prevPage => prevPage - 1);
    }

    function handlePageWithError(page: number) {
        setPage(page);
    }

    const pages: SignUpPagesArrayType = prepareSignUpPages({
        navigation,
        handleBack,
        handleNextPage,
        handlePageWithError,
        animationDuration,
    });

    return (
        <View style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <SignUpPanel
                {...pages[page]}
                page={page}
                pages={pages}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        marginHorizontal: spacing.SCALE_20,
        marginVertical: spacing.SCALE_20,
        flex: 1,
        justifyContent: 'space-between',
    },
    textFieldsContainer: {

    },
    subTitleText: {
        fontSize: typography.FONT_SIZE_16,
        textAlign: 'center',
        paddingHorizontal: spacing.SCALE_20,
    },
    textContainer: {
        overflow: 'hidden',
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    }
})