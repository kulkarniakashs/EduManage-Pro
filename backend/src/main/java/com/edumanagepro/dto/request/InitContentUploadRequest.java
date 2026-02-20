package com.edumanagepro.dto.request;

import com.edumanagepro.entity.enums.ContentType;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class InitContentUploadRequest {
    private String title;
    private String description;

    private ContentType type;      // VIDEO / PDF
    private String contentType;    // application/pdf, video/mp4, etc.

    private boolean published = true;
    private boolean protectedContent = true; // keep true for paid content
}
