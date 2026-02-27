package com.edumanagepro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DeleteContentItemResponse {
    private boolean deleted;
    private boolean deletedObject;
}