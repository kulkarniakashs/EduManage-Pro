package com.edumanagepro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InitContentUploadResponse {
    private ContentItemResponse contentItem; // ✅ created item (UPLOADING)
    private String uploadUrl;
    private int expiresInMinutes;
}
