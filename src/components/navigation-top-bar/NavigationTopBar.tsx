import { ReactNode } from 'react'
import { NAVIGATION_TOP_BAR_TYPES } from './navigationTopBarTypes';
import { prepareNavigationTopBar } from './helpers';
import { navigationTypes } from '.';

type NavigationTopBarProps = {
    name: string;
    icon?: ReactNode;
    color?: string;
    onTitlePress?: () => void;
    type: NAVIGATION_TOP_BAR_TYPES;
    handleShowDetailsBottomSheet?: () => void;
    extraActionWhenGoBackPressed?: () => void;
};

type NavigationTopBarElement = {
    type: navigationTypes.NAVIGATION_TOP_BAR_TYPES;
    navigationTopBar?: JSX.Element;
    navigationTypes?: JSX.Element;
};

export default function NavigationTopBar({
    name,
    icon,
    onTitlePress,
    color,
    type,
    handleShowDetailsBottomSheet,
    extraActionWhenGoBackPressed,
}: NavigationTopBarProps) {
    const navigationTopBars = prepareNavigationTopBar({
        name: name,
        icon: icon,
        color: color,
        onTitlePress: onTitlePress,
        handleShowDetailsBottomSheet: handleShowDetailsBottomSheet,
        extraActionWhenGoBackPressed: extraActionWhenGoBackPressed,
    });

    function getNavigationTopBarById(navigationTopBars: NavigationTopBarElement[], type: navigationTypes.NAVIGATION_TOP_BAR_TYPES) {
        return navigationTopBars.find(navigationTopBar => navigationTopBar.type === type);
    }

    const navigationTopBar: NavigationTopBarElement = getNavigationTopBarById(navigationTopBars, type) as NavigationTopBarElement;

    return (
        <>
            {navigationTopBar && navigationTopBar.navigationTopBar}
        </>
    );
};
