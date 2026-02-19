package com.edumanagepro.dto.request;

import com.edumanagepro.entity.enums.UserRole;
import lombok.Getter; import lombok.Setter;
import java.util.UUID;

@Getter @Setter
public class CreateUserRequest {
    private UUID instituteId;
    private String fullName;
    private String email;
    private String password;
    private UserRole role; // TEACHER / STUDENT
}
