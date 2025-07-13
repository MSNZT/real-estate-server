export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface AuthTokenPayload {
  email: string;
  name: string;
}
