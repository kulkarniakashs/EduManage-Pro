import { http } from "../lib/http";
import type {
  ChangePasswordRequest,
  ConfirmObjectKeyRequest,
  MeResponse,
  PresignUploadResponse,
  UpdateProfileRequest,
} from "../types/me";

export const profileApi = {
  async me(): Promise<MeResponse> {
    const res = await http.get<MeResponse>("/me");
    return res.data;
  },

  async getMyProfilePhotoUrl(): Promise<string> {
    const res = await http.get<{ url: string }>(
      `/me/profile-photo/url?ts=${Date.now()}`,
    );
    return res.data.url;
  },

  async updateProfile(req: UpdateProfileRequest): Promise<MeResponse> {
    const res = await http.put<MeResponse>("/me", req);
    return res.data;
  },

  async changePassword(req: ChangePasswordRequest): Promise<void> {
    await http.put("/me/password", req);
  },

  async presignProfilePhoto(
    contentType: string,
  ): Promise<PresignUploadResponse> {
    const res = await http.post<PresignUploadResponse>(
      `/me/profile-photo/presign?contentType=${encodeURIComponent(contentType)}`,
    );
    return res.data;
  },

  async confirmProfilePhoto(req: ConfirmObjectKeyRequest): Promise<MeResponse> {
    const res = await http.put<MeResponse>("/me/profile-photo", req);
    return res.data;
  },
};
