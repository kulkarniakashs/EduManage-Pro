package com.edumanagepro.dto.response;


import com.edumanagepro.entity.Subject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class SubjectDetailsWithModulesResponse {
    private UUID subjectId;
    private String subjectName;
    private String description;
    private String thumbnailUrl;
    private UUID teacherId;
    private String teacherName;
    private String teacherProfilePhotoUrl;
    private List<ModuleResponse> modules;
}
