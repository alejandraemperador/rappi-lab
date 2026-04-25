export const UserRole = {
    CONSUMER: 'consumer',
    STORE: 'store',
    DELIVERY: 'delivery',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
    id: string;
    email: string;
    name: string | null;
    password: string;
    role: UserRole;
}

export interface CreateUserDTO {
    email: string;
    name?: string | null;
    password: string;
    role: UserRole;
    storename?: string;
}

export interface AuthenticateUserDTO {
    email: string;
    password: string;
}

export interface AuthData {
    user: User;
    token: string;
}
