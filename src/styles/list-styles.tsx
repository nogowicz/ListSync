import { ReactNode } from 'react';

import ListDefault from 'assets/list-icons/list-default.svg'
import ListIcon from 'assets/list-icons/list-icon.svg';
import ShoppingCart from 'assets/list-icons/shopping-cart.svg';
import HeartIcon from 'assets/list-icons/heart-icon.svg';
import PlaneIcon from 'assets/list-icons/plane-icon.svg';
import HomeIcon from 'assets/list-icons/home-icon.svg';
import EarthIcon from 'assets/list-icons/earth-icon.svg';

export const listIconTheme: Record<number, ReactNode> = {
    0: (<ListDefault fill='#0860FB' />),
    1: (<ListIcon />),
    2: (<ShoppingCart />),
    3: (<HeartIcon />),
    4: (<PlaneIcon />),
    5: (<HomeIcon />),
    6: (<EarthIcon />),
};

export const listColorTheme: Record<number, string> = {
    0: '#0860FB',
    1: '#46B1BF',
    2: '#F7917D',
    3: '#58CB7B',
    4: '#AA69C4',
    5: '#8F86C9',
};
