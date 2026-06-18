export interface IUpdateProfile {
  user_id: number;
  name: string;
  email: string;
  password?: string | undefined;
  old_password?: string | undefined;
}
