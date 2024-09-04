export interface UserData {
  userCode: string;
  userId: number;
  fullname: string;
  userName: string;
  dob: Date;
  gender: "Male" | "Female";
  phone: string;
  roleId: number;
  createDate: Date;
  isActive: boolean;
  status: number;
  updateBy: string;
  updateDate: Date;
}
