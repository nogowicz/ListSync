import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserType {
    id: number;
    firstName: string;
    lastName: string;
    photoURL: string | null;
    email: string;
}

interface UserContextProps {
    user: UserType | null;
    setUserDetails: (userData: UserType | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

type UserProviderProps = {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<UserType | null>(null);

    const setUserDetails = (userData: UserType | null) => {
        setUser(userData);
    };

    return (
        <UserContext.Provider value={{ user, setUserDetails }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextProps => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
