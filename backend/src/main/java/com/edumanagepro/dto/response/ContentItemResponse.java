package com.edumanagepro.dto.response;

import com.edumanagepro.entity.ContentItem;
import com.edumanagepro.entity.enums.ContentType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class ContentItemResponse {
    private UUID id;
    private UUID moduleId;
    private String title;
    private String description;
    private ContentType type;
    private String objectKey;
    private boolean uploadStatus;  // UPLOADING / READY
    private boolean published;
    private boolean protectedContent;

    public static  ContentItemResponse toContentItemResponse(ContentItem c) {
        return new ContentItemResponse(c.getId(), c.getModule().getId(), c.getTitle(), c.getDescription(),
                c.getType(), c.getObjectKey(), c.getUploadStatus(), c.isPublished(), c.isProtectedContent());
    }
}
