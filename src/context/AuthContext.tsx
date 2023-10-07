import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { removeItem, setItem } from "utils/asyncStorage";
import { createListTable, createSubtaskTable, createTaskListTable, createTaskTable, createUserTable, loginUser, registerUser } from "utils/database";
import { API_URL } from '@env';
import jwtDecode from 'jwt-decode';


type AuthContextType = {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    ) => Promise<void>;
    logout: () => Promise<void>;
}    // resetPassword: (email: string) => Promise<void>;
// updateEmail: (newEmail: string) => Promise<void>;
// updatePersonalData: (firstName: string, lastName: string) => Promise<void>,
// updateProfilePicture: (imageUrl: string | null | undefined) => Promise<void>,
// updatePassword: (newPassword: string) => Promise<void>;

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    login: async () => { },
    register: async () => { },
    logout: async () => { },
    // resetPassword: async () => { },
    // updateEmail: async () => { },
    // updatePersonalData: async () => { },
    // updateProfilePicture: async () => { },
    // updatePassword: async () => { },
});



type AuthProviderProps = {
    children: ReactNode,
}

type UserType = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    photo: string;
    createdAt: string;
    exp: number;
}


export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        createUserTable();
        createSubtaskTable();
        createTaskTable();
        createListTable();
        createTaskListTable();
    }, []);


    return <AuthContext.Provider
        value={{
            user,
            setUser,
            login: async (email: string, password: string) => {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "accept": "text/plain"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,

                    })
                });

                const responseData = await response.text();
                if (!response.ok) {
                    throw new Error(responseData);
                }


                const decodedResponseData: UserType = jwtDecode(responseData);
                setItem('user', JSON.stringify(decodedResponseData));
                setUser(decodedResponseData);

            },
            register: async (
                email: string,
                password: string,
                firstName: string,
                lastName: string,
            ) => {
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "accept": "text/plain"
                    },
                    body: JSON.stringify({
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        password: password,

                    })
                });
                const responseData = await response.text();
                if (!response.ok) {
                    throw new Error(responseData);
                }
                const responseLogin = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "accept": "text/plain"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,

                    })
                });

                const responseLoginData = await responseLogin.text();
                if (!response.ok) {
                    throw new Error(responseLoginData);
                }


                const decodedResponseData: UserType = jwtDecode(responseLoginData);
                setItem('user', JSON.stringify(decodedResponseData));
                setUser(decodedResponseData);

            },

            logout: async () => {
                try {
                    setUser(null);
                    removeItem('user');
                } catch (error) {
                    console.log(error);
                }
            },
            // resetPassword: async (email: string) => {
            //     await auth().sendPasswordResetEmail(email);
            // },

            // updateEmail: async (newEmail: string) => {
            //     const user = auth().currentUser;
            //     if (user) {
            //         await user.updateEmail(newEmail);
            //         await user.sendEmailVerification();
            //     }
            // },
            // updatePersonalData: async (firstName: string, lastName: string) => {
            //     const user = auth().currentUser;
            //     if (user) {
            //         await user.updateProfile({
            //             displayName: `${firstName.trim()} ${lastName.trim()}`
            //         });
            //     }
            // },
            // updateProfilePicture: async (imageUrl: string | null | undefined) => {
            //     const user = auth().currentUser;
            //     if (user) {
            //         await user.updateProfile({
            //             photoURL: imageUrl
            //         });
            //     }
            // },
            // updatePassword: async (newPassword: string) => {
            //     const user = auth().currentUser;
            //     if (user) {
            //         await user.updatePassword(newPassword);
            //     }
            // },
        }}>{children}</AuthContext.Provider>
}


export function useAuth() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return authContext;
}