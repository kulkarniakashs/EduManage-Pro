package com.edumanagepro.dto.request;

import lombok.*;

import java.util.UUID;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CreateSubjectRequest {
    private UUID classRoomId;
    private UUID teacherId;
    private String name;
//    private String code;
    private String description;
    private String thumbnailUrl; // optional; teacher can change later
}
