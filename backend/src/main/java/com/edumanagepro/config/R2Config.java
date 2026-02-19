package com.edumanagepro.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

@Configuration
public class R2Config {

    @Bean
    public StaticCredentialsProvider r2Credentials(
            @Value("${app.r2.access-key}") String accessKey,
            @Value("${app.r2.secret-key}") String secretKey
    ) {
        return StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey));
    }

    @Bean
    public S3Client r2S3Client(
            StaticCredentialsProvider creds,
            @Value("${app.r2.endpoint}") String endpoint
    ) {
        return S3Client.builder()
                .credentialsProvider(creds)
                .endpointOverride(URI.create(endpoint))
                .region(Region.of("auto"))
                .serviceConfiguration(
                        S3Configuration.builder()
                                .pathStyleAccessEnabled(true)
                                .chunkedEncodingEnabled(false) // important for R2
                                .build()
                )
                .build();
    }

    @Bean
    public S3Presigner r2Presigner(
            StaticCredentialsProvider creds,
            @Value("${app.r2.endpoint}") String endpoint
    ) {
        return S3Presigner.builder()
                .credentialsProvider(creds)
                .endpointOverride(URI.create(endpoint))
                .region(Region.of("auto"))
                .build();
    }
}
