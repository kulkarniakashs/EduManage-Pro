package com.edumanagepro.dto.response;

import com.edumanagepro.entity.Module;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class ModuleResponse {

    private UUID id;
    private String title;
    private String description;
    private Instant createdAt;

    public static ModuleResponse toModuleResponse(Module m) {
        return new ModuleResponse(m.getId(), m.getTitle(), m.getDescription(), m.getCreatedAt());
    }
}
