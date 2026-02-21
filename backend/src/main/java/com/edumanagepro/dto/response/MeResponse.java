package com.edumanagepro.dto.response;

import com.edumanagepro.entity.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class MeResponse {
    private UUID id;
    private String name;
    private UserRole role;
    private String profilePhotoKey;
    private String email;
}
