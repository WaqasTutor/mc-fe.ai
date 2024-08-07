export interface UserInterface {
  uuid?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  status?: string;
  last_login?: Date;
  workspaces?: Workspace[];
  subscription_status?: string;
  auth_time?: number;
  exp?: number;
  onboarding_step: userStatus;
}
export enum userStatus {
  SUBSCRIPTION = 'SUBSCRIPTION',
  ONBOARDING = 'ONBOARDING',
  COMPLETE = 'COMPLETE',
}

export interface Workspace {
  uuid?: string;
  created_on?: Date;
  admin_user_uuid?: string;
  name?: string;
}
export interface signupInput {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  password?: string;

}
export interface signupOutput {
  status?: string;
  message?: string;
  data?: Data;
}

export interface Data {
  email?: string;
  uuid?: string;
}
export interface UserUpdateInput {
  email?: string;
  first_name?: string;
  last_name?: string;
  company_id?: number;
  user_type?: string;
  role?: string;
  use_case?: string;
  onboarding_step: userStatus;

}

export interface UserUpdatePassword {
  current_password: string;
  new_password: string;
  confirm_password: string;
  auth_token: string;
}

