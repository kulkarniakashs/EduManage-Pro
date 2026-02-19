package com.edumanagepro.dto.request;

import lombok.Getter; import lombok.Setter;
import java.time.LocalDate;
import java.util.UUID;

@Getter @Setter
public class CreateAcademicYearRequest {
    private UUID instituteId;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active = true;
}
