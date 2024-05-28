type JSONResponse = {
    data: Record<string, any>;
    ok: boolean;
    status: number;
    statusText: string;
    url: string;
    headers: Record<string, any>;
    redirected: boolean;
    bodyUsed: boolean;
};

type LoginCredentials = {
    username: string;
    password: string;
};

interface RegisterCredentials extends LoginCredentials {
    email: string;
}

type Model = {
    id: number;
};

interface UserPartial extends Model {
    username: string;
    profile_picture: string | null;
    is_public: boolean;
    is_superuser: boolean;
}

interface User extends UserPartial {
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

interface CategoryPartial extends Model {
    title: string;
}

interface Category extends CategoryPartial {
    parent_category: CategoryPartial | null;
    children: Category[];
    posts: number;
}

interface PostMixin extends Model {
    content: string;
    publisher: UserPartial;
    reactions: {
        neg: Reaction[];
        pos: Reaction[];
    };
    publish_time: string;
    update_time: string;
}

interface PostPartial extends PostMixin {
    id: number;
    title: string;
    categories: {
        id: number;
        title: string;
    }[];
    comments: number;
}

interface Post extends PostPartial {
    content_parsed: string;
    comments: PostComment[];
}

interface Reaction extends Model {
    type: boolean;
    publisher: UserPartial;
}

interface PostComment extends PostMixin {
    content_parsed: string;
    replies: Reply[];
}

type Reply = PostComment;

type Order = 'best' | 'new' | 'old' | 'worst';
