export type UUID = string;

export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export type CreateUserRequest = {
  fullName: string;
  email: string;
  password: string;
  role: Role;
};

export type CreateUserResponse = {
  id: UUID;
  fullName: string;
  email: string;
  role: Role;
};