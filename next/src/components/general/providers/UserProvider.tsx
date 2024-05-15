'use client';

import { createContext } from 'react';

type User = {
    id: number;
    username: string;
    email: string;
    last_login: string;
    first_name: string;
    last_name: string;
    sex: string;
    birthdate: string;
    profile_picture: string;
    is_public: boolean;
    is_superuser: boolean;
};

export const UserContext = createContext<User>(null as unknown as User);

export default async function UserProvider(
    {
        children,
        user
    }: {
        children: React.ReactNode;
        user: User;
    }
) {
    return <UserContext.Provider
        value={user}
    >
        {children}
    </UserContext.Provider>
}
