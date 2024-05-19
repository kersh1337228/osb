declare type JSONResponse = {
    data: Record<string, any>;
    ok: boolean;
    status: number;
    statusText: string;
    url: string;
    headers: Record<string, any>;
    redirected: boolean;
    bodyUsed: boolean;
};

declare type LoginCredentials = {
    username: string;
    password: string;
};

declare interface RegisterCredentials extends LoginCredentials {
    email: string;
}

declare type UserPartial = {
    id: number;
    username: string;
    profile_picture: string | null;
    is_public: boolean;
    is_superuser: boolean;
};

declare interface User extends UserPartial {
    email: string;
    last_login: string;
    first_name: string | null;
    last_name: string | null;
    sex: string | null;
    birthdate: string | null;
    website: string | null;
    about: string | null;
    posts: PostPartial[];
}

declare type CategoryPartial = {
    id: number;
    title: string;
};

declare type Category = {
    id: number;
    title: string;
    children: Category[];
};

declare type PostPartial = {
    id: number;
    title: string;
    categories: {
        id: number;
        title: string;
    }[];
    content: string;
    publisher: UserPartial;
    reactions: {
        neg: Reaction[];
        pos: Reaction[];
    };
    comments: number;
    publish_time: string;
    update_time: string;
};

declare interface Post extends PostPartial {
    comments: PostComment[];
}

declare type Reaction = {
    id: number;
    type: boolean;
    publisher: UserPartial;
};

declare type PostComment = {
    id: number;
    publisher: UserPartial;
    reactions: {
        neg: Reaction[];
        pos: Reaction[];
    };
    replies: Reply[];
    content: string;
    publish_time: string;
    update_time: string;
};

declare type Reply = {
    id: number;
    publisher: UserPartial;
    reactions: {
        neg: Reaction[];
        pos: Reaction[];
    };
    replies: Reply[];
    content: string;
    publish_time: string;
    update_time: string;
};
