export interface BranchForm {
  brandName: {
    id: string;
    value: string;
    errorMessage: string;
  };
  city: {
    id: string;
    name: string;
    errorMessage: string;
  };
  district: {
    id: string;
    name: string;
    errorMessage: string;
  };
  ward: {
    id: string;
    name: string;
    errorMessage: string;
  };
  address: {
    value: string;
    errorMessage: string;
  };
}
