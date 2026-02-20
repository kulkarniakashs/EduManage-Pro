package com.edumanagepro.dto.response;

import com.edumanagepro.dto.response.ContentItemResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ConfirmUploadResponse {
    private ContentItemResponse contentItem; // ✅ full details after READY
}
