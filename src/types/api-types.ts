export type fetchGenerateToneT = (
  data: fetchGenerateToneRequestT
) => Promise<fetchGenerateToneRequestT>;
export type fetchGenerateToneRequestT = {
  band: string;
  amp?: string;
  ir?: string;
};
export type fetchGenerateToneResponseT = {
  message: string;
};
type UserCredentialsT = {
  email: string;
  password: string;
};
export type UserT = {
  id: number;
  email: string;
  username: string;
};
export type LoginResponseT = {
  access_token: string;
  refresh_token: string;
  user: UserT;
};
type LogoutResponseT = {
  message: string;
};
type SignUpResponseT = {
  message: string;
};
export interface UserApiI {
  signUp: (credentials: UserCredentialsT) => Promise<SignUpResponseT>;
  login: (credentials: UserCredentialsT) => Promise<LoginResponseT>;
  logout: () => Promise<LogoutResponseT>;
  getCurrentUser: () => Promise<UserT>;
}
