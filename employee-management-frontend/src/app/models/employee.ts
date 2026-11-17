
export interface Employee {
  id: number;
  name: string;
  email: string;
  salary: number;
  departmentId: number;
  departmentName: string;
}

export interface EmployeeRequest {
  name: string;
  email: string;
  salary: number;
  departmentId: number;
}
