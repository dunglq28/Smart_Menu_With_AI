interface IDictionary<T> {
  [key: string]: T;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  isSuccess: boolean;
  errors: IDictionary<string[]>;
  data: T;
}

export interface ApiResponseNotPagin<T> {
  statusCode: number;
  message: string;
  isSuccess: boolean;
  errors: IDictionary<string[]>;
  data: T[];
}
