export type TAuthCredential = {
  email: string;
  password: string;
};

export enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
}

export type TUser = TAuthCredential & {
  id: string;
  username: string;
  avatar: string;
  createdAt: string;
  fullname: string;
  role: ROLE | string;
  updatedAt: string;
};

export type TResponse<T> = {
  status: string;
  message: string;
  data?: T;
};

export type TRegisterCredential = TAuthCredential & {
  username: string;
  fullname: string;
};

export type TAuthState = {
  id: string;
  email: string;
  username: string;
  avatar: string;
  fullname: string;
  role: ROLE | string;
  expired: number
}