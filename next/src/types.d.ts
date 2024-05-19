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

declare type Model = {
    id: number;
};

declare interface UserPartial extends Model {
    username: string;
    profile_picture: string | null;
    is_public: boolean;
    is_superuser: boolean;
}

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

declare interface CategoryPartial extends Model {
    title: string;
}

declare interface Category extends CategoryPartial {
    children: Category[];
}

declare interface PostMixin extends Model {
    content: string;
    publisher: UserPartial;
    reactions: {
        neg: Reaction[];
        pos: Reaction[];
    };
    publish_time: string;
    update_time: string;
}

declare interface PostPartial extends PostMixin {
    id: number;
    title: string;
    categories: {
        id: number;
        title: string;
    }[];
    comments: number;
}

declare interface Post extends PostPartial {
    comments: PostComment[];
}

declare interface Reaction extends Model {
    type: boolean;
    publisher: UserPartial;
}

declare interface PostComment extends PostMixin {
    replies: Reply[];
}

declare type Reply = PostComment;
