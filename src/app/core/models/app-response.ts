export interface AppResponse<T> {
  success: boolean;
  exceptionMessage: string;
  data: T;
  errorCode: string;
  errorMessage: string;
}
