package com.edumanagepro.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class R2PublicStorageService {

    private final S3Presigner presigner;

    @Value("${app.r2.public.bucket}")
    private String publicBucket;

    @Value("${app.r2.presign-minutes:10}")
    private int presignMinutes;

    public PresignedUpload presignProfilePhotoPut(UUID userId, String contentType) {
        return presignGenericPut("profile-photos/" + userId, contentType);
    }

    public PresignedUpload presignGenericPut(String prefix, String contentType) {
        String ext = switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png"  -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new RuntimeException("Unsupported contentType");
        };

        String objectKey = prefix + "/" + UUID.randomUUID() + ext;

        PutObjectRequest putReq = PutObjectRequest.builder()
                .bucket(publicBucket)
                .key(objectKey)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignReq = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(presignMinutes))
                .putObjectRequest(putReq)
                .build();

        String uploadUrl = presigner.presignPutObject(presignReq).url().toString();
        return new PresignedUpload(objectKey, uploadUrl, presignMinutes);
    }

    public record PresignedUpload(String objectKey, String uploadUrl, int expiresMinutes) {}
}
