export interface LoginRequest {
  userName: string;
  password: string;
  forceLogin: boolean;
}
export interface LoginResponse {
  token: string;
  refreshToken: string;
  refreshTokenExpiration: string;
  need2FA: boolean;
  userName: string;
  isLockout: boolean;
  isNotAllowed: boolean;
  anotherDeviceLoggedIn: boolean;
}
