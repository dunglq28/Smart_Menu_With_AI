export interface UserForm {
  fullName: {
    value: string;
    errorMessage: string;
  };
  userName: {
    value: string;
    errorMessage: string;
  };
  phoneNumber: {
    value: string;
    errorMessage: string;
  };
  DOB: {
    value: Date | null;
    errorMessage: string;
  };
  gender: {
    value: string;
    errorMessage: string;
  };
  isActive: {
    value: number | null;
    errorMessage: string;
  };
}
