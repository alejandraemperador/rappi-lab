export enum UserRole {
  CONSUMER = 'consumer',
  STORE = 'store',
  DELIVERY = 'delivery',
}

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
  storeName?: string;
}

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}
