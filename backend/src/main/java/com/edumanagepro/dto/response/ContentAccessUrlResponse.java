package com.edumanagepro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ContentAccessUrlResponse {
    private ContentItemResponse contentItem;
    private String url;
    private int expiresInMinutes;
}