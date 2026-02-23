package com.edumanagepro.dto.response;

import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TeacherAttendanceSubjectResponse {
    private UUID subjectId;
    private String subjectName;
    private String classRoomName;
    private String academicYearName;
}