package com.edumanagepro.dto.response;

import com.edumanagepro.entity.Subject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TeacherSubjectResponse {
    private UUID subjectId;
    private String subjectName;
    private String thumbnailUrl;

    public static TeacherSubjectResponse toTeacherSubjectResponse(Subject sub){
        return new TeacherSubjectResponse(sub.getId(), sub.getName(), sub.getThumbnailUrl());
    }
}