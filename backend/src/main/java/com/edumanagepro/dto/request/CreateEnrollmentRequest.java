package com.edumanagepro.dto.request;

import lombok.Getter; import lombok.Setter;
import java.util.UUID;

@Getter @Setter
public class CreateEnrollmentRequest {
    private UUID studentId;
    private UUID academicYearId;
    private UUID classRoomId;
}
