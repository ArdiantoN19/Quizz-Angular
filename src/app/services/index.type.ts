export type TResponse<T> = {
    status: string;
    message: string;
    data?: T;
  };
  