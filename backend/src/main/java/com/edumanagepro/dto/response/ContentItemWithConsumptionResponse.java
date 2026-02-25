package com.edumanagepro.dto.response;

import com.edumanagepro.entity.ContentConsumption;
import com.edumanagepro.entity.ContentItem;
import com.edumanagepro.entity.enums.ConsumptionStatus;
import com.edumanagepro.entity.enums.ContentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContentItemWithConsumptionResponse {
    private UUID id;
    private UUID moduleId;
    private String title;
    private String description;
    private ContentType type;
    private String objectKey;
    private boolean uploadStatus;  // UPLOADING / READY
    private boolean published;
    private boolean protectedContent;

    private ConsumptionStatus consumptionStatus;
    private int progressPercent;       // for VIDEO
    private boolean visited;           // for PDF/simple indicator
    private int lastPositionSeconds;

    public static ContentItemWithConsumptionResponse toContentItem(ContentItem ci, ContentConsumption cc){
        ConsumptionStatus st = cc != null ? cc.getStatus() : ConsumptionStatus.NOT_STARTED;
        int pct = cc != null ? cc.getProgressPercent() : 0;
        int last = cc != null ? cc.getLastPositionSeconds() : 0;

        boolean visited = st != ConsumptionStatus.NOT_STARTED;

        return new ContentItemWithConsumptionResponse(ci.getId(),ci.getModule().getId(), ci.getTitle(), ci.getDescription(), ci.getType(), ci.getObjectKey(), ci.getUploadStatus(),ci.isPublished(), ci.isProtectedContent(), st, pct, visited, last);
    }
}
