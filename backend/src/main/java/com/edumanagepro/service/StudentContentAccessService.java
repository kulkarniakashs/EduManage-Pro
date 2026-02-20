package com.edumanagepro.service;

import com.edumanagepro.dto.response.ContentAccessUrlResponse;
import com.edumanagepro.dto.response.ContentItemResponse;
import com.edumanagepro.dto.response.StudentMyClassResponse;
import com.edumanagepro.entity.ContentItem;
import com.edumanagepro.repository.ContentItemRepository;
import com.edumanagepro.security.AccessValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentContentAccessService {
    private final AccessValidator accessValidator;
    private final ContentItemRepository contentItemRepository;
    private final R2ContentStorageService r2;

    public ContentAccessUrlResponse getAccessUrl(UUID studentId, UUID contentItemId) {

        accessValidator.validateStudentContentAccessByContentId(studentId, contentItemId);

        ContentItem ci = contentItemRepository.findById(contentItemId).orElseThrow();

        if (!ci.isPublished()) throw new RuntimeException("Not published");
        if (!ci.getUploadStatus()) throw new RuntimeException("Not ready");

        var p = r2.presignGet(ci.getObjectKey());
        return new ContentAccessUrlResponse(ContentItemResponse.toContentItemResponse(ci),p.url(), p.expiresInMinutes());
    }

}