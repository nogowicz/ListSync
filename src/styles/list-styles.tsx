import ListDefault from 'assets/list-icons/list-default.svg'
import ListIcon from 'assets/list-icons/list-icon.svg';
import ShoppingCart from 'assets/list-icons/shopping-cart.svg';
import { ReactNode } from 'react';

export const listIconTheme: Record<number, ReactNode> = {
    1: (<ListDefault fill='#0860FB' />),
    2: (<ListIcon />),
    3: (<ShoppingCart />)
};

export const listColorTheme: Record<number, string> = {
    1: '#0860FB',
    2: '#46B1BF',
    3: '#F7917D',
    4: '#58CB7B',
    5: '#AA69C4',
    6: '#8F86C9',
};
