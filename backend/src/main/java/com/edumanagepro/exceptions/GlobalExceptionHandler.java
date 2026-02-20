package com.edumanagepro.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    public record ApiError(
            Instant timestamp,
            int status,
            String error,
            String message,
            String path
    ) {}

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiError> handleApiException(ApiException ex, HttpServletRequest req) {
        var status = ex.getStatus();
        return ResponseEntity.status(status).body(new ApiError(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                req.getRequestURI()
        ));
    }

    // fallback (unexpected errors)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleAny(Exception ex, HttpServletRequest req) {
        System.out.println(ex.toString());
        var status = 500;
        return ResponseEntity.status(status).body(new ApiError(
                Instant.now(),
                status,
                ex.getLocalizedMessage(), ex.getMessage(),
                req.getRequestURI()
        ));
    }
}
