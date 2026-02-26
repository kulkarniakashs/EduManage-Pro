package com.edumanagepro.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateRazorpayOrderRequest {
    private UUID academicYearId;
    private UUID classRoomId;

    public UUID getAcademicYearId() { return academicYearId; }
    public void setAcademicYearId(UUID academicYearId) { this.academicYearId = academicYearId; }

    public UUID getClassRoomId() { return classRoomId; }
    public void setClassRoomId(UUID classRoomId) { this.classRoomId = classRoomId; }
}