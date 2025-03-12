export enum ESTATUS {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL'
}

export type TResponse<T> = {
    status: ESTATUS;
    message: string;
    data?: T;
  };
  