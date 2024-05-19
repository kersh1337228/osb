'use client';

import {
    createContext
} from 'react';

export const UserContext = createContext<UserPartial | null>(null);

export default function UserProvider(
    {
        user,
        children
    }: {
        user: UserPartial;
        children: React.ReactNode;
    }
) {
    return <UserContext.Provider
        value={user}
    >
        {children}
    </UserContext.Provider>;
}

