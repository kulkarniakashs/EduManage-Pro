package com.edumanagepro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class StudentMyClassResponse {
    private UUID academicYearId;
    private String academicYearName;

    private UUID classRoomId;
    private String classRoomName;

    private List<SubjectResponse> subjects;
}