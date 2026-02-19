package com.edumanagepro.dto.request;

import lombok.Getter; import lombok.Setter;
import java.util.UUID;

@Getter @Setter
public class CreateClassRoomRequest {
    private UUID academicYearId;
    private String name;
    private String gradeOrProgram;
    private String section;
    private boolean active = true;
}
