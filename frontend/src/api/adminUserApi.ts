import { http } from "../lib/http";
import type { CreateUserRequest, CreateUserResponse } from "../types/adminUsers";

export const adminUsersApi = {
  async createUser(req: CreateUserRequest): Promise<CreateUserResponse> {
    console.log(req, "in create user")
    const res = await http.post<CreateUserResponse>("/admin/users", req);
    return res.data;
  },
};