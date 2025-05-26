export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface RegisterOAuthTokenResponse {
  email: string;
  name: string;
}
