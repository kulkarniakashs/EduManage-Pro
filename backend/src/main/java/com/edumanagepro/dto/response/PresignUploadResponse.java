package com.edumanagepro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PresignUploadResponse {
    private String objectKey;
    private String uploadUrl;
    private String requiredContentType;
    private int expiresInMinutes;
}

