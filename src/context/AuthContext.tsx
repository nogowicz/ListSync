import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { removeItem, setItem } from "utils/asyncStorage";
import { createListTable, createSubtaskTable, createTaskTable, createUserTable, loginUser, registerUser } from "utils/database";


type AuthContextType = {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        errorHandlers: {
            onRegistrationSuccess: () => void;
            onEmailTaken: () => void;
            onOtherError: (error: Error) => void;
        },) => Promise<void>;
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
    ID: number;
    email: string;
    firstName: string;
    lastName: string;
}


export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        createUserTable();
        createSubtaskTable();
        createTaskTable();
        createListTable();
    }, []);


    return <AuthContext.Provider
        value={{
            user,
            setUser,
            login: async (email: string, password: string) => {
                try {
                    await loginUser(
                        email,
                        password,
                        (userData: UserType) => {
                            console.log(userData);
                            setItem('user', JSON.stringify(userData));
                            setUser(userData);
                        },
                        error => {
                            console.error('Login error:', error);
                        }
                    );
                } catch (error) {
                    console.log(error);
                }
            },
            register: async (
                email: string,
                password: string,
                firstName: string,
                lastName: string,
                errorHandlers: {
                    onRegistrationSuccess: () => void;
                    onEmailTaken: () => void;
                    onOtherError: (error: Error) => void;
                }
            ) => {
                try {
                    await registerUser(
                        email,
                        password,
                        firstName,
                        lastName,
                        {
                            onRegistrationSuccess: () => {
                                errorHandlers.onRegistrationSuccess();
                            },
                            onEmailTaken: () => {
                                console.error('Email is already taken');
                                errorHandlers.onEmailTaken();
                            },
                            onOtherError: error => {
                                console.error('Register error:', error);
                                errorHandlers.onOtherError(error);
                            },
                        }
                    );
                } catch (error) {
                    console.error('Register error:', error);
                }
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