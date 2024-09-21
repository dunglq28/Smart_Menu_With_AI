export interface Password {
  oldPassword: string;
  newPassword: string;
  confirm: string;
}

export interface PasswordForm {
  oldPassword: { value: string; errorMessage: string };
  newPassword: { value: string; errorMessage: string };
  confirm: { value: string; errorMessage: string };
}
