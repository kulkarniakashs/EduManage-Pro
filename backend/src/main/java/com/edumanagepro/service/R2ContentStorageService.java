package com.edumanagepro.service;

import com.edumanagepro.config.R2Config;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class R2ContentStorageService {

    private final S3Presigner presigner;
    private final S3Client r2;

    @Value("${app.r2.bucket}") // ✅ your main (private) content bucket
    private String bucket;

    @Value("${app.r2.presign-upload-minutes:10}")
    private int uploadMinutes;

    @Value("${app.r2.presign-view-minutes:25}")
    private int viewMinutes;

    public PresignedUrl presignPut(String objectKey, String contentType) {
        PutObjectRequest putReq = PutObjectRequest.builder()
                .bucket(bucket)
                .key(objectKey)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignReq = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(uploadMinutes))
                .putObjectRequest(putReq)
                .build();

        String url = presigner.presignPutObject(presignReq).url().toString();
        return new PresignedUrl(objectKey, url, uploadMinutes);
    }

    public PresignedUrl presignGet(String objectKey) {
        GetObjectRequest getReq = GetObjectRequest.builder()
                .bucket(bucket)
                .key(objectKey)
                .build();

        GetObjectPresignRequest presignReq = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(viewMinutes))
                .getObjectRequest(getReq)
                .build();

        String url = presigner.presignGetObject(presignReq).url().toString();
        return new PresignedUrl(objectKey, url, viewMinutes);
    }

    public void deleteObjectIfPresent(String objectKey) {
        if (objectKey == null || objectKey.isBlank()) return;

        r2.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(objectKey)
                .build());
    }

    // ✅ NEW: delete multiple objects
    public int deleteObjectsIfPresent(List<String> objectKeys) {
        if (objectKeys == null || objectKeys.isEmpty()) return 0;
        int n = 0;
        for (String k : objectKeys) {
            if (k == null || k.isBlank()) continue;
            deleteObjectIfPresent(k);
            n++;
        }
        return n;
    }

    public record PresignedUrl(String objectKey, String url, int expiresInMinutes) {}
}
