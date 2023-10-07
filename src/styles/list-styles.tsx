import ListDefault from 'assets/list-icons/list-default.svg'
import ListIcon from 'assets/list-icons/list-icon.svg';
import ShoppingCart from 'assets/list-icons/shopping-cart.svg';
import { ReactNode } from 'react';

export const listIconTheme: Record<number, ReactNode> = {
    0: (<ListDefault fill='#0860FB' />),
    1: (<ListIcon />),
    2: (<ShoppingCart />)
};

export const listColorTheme: Record<number, string> = {
    0: '#0860FB',
    1: '#46B1BF',
    2: '#F7917D',
    3: '#58CB7B',
    4: '#AA69C4',
    5: '#8F86C9',
};
