'use client';

import React, {
    createContext
} from 'react';

export const UserContext = createContext<UserPartial | null>(null);

export default function UserProvider(
    {
        user,
        children
    }: {
        user: UserPartial | null;
        children: React.ReactNode;
    }
) {
    return <UserContext.Provider
        value={user}
    >
        {children}
    </UserContext.Provider>;
}

