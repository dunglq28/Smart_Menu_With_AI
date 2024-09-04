interface IDictionary<T> {
  [key: string]: T;
}

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

interface UserLoginData {
  userId: number;
  roleId: number;
  token: TokenData;
}

export interface LoginResponse {
  data: UserLoginData;
  errors: IDictionary<string[]>;
  isSuccess: boolean;
  message: string;
  statusCode: number;
}
