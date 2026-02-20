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
public class SubjectResponse {
    private UUID subjectId;
    private String subjectName;
    private String thumbnailUrl;
    private UUID teacherId;
    private String teacherName;
    private String teacherProfilePhotoUrl;

    public static SubjectResponse toSubjectResponse(Subject sub){
        return new SubjectResponse(sub.getId(), sub.getName(), sub.getThumbnailUrl(), sub.getTeacher().getId(), sub.getTeacher().getFullName(), sub.getTeacher().getProfilePhotoKey());
    }

}
