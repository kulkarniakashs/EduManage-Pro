package com.edumanagepro.dto.request;

import lombok.Getter; import lombok.Setter;
import java.util.UUID;

@Getter @Setter
public class CreateSubjectRequest {
    private UUID classRoomId;
    private UUID teacherId;
    private String name;
    private String code;
    private String description;
    private String thumbnailUrl; // optional; teacher can change later
}
