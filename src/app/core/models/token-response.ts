
export interface TokenResponse {
  accessToken: string,
  refreshToken: string,
  roles?: string[],
  permissions?: string[],
  procedures?: string[]
}
