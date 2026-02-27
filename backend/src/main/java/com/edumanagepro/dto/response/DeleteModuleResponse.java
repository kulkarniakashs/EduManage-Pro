package com.edumanagepro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DeleteModuleResponse {
    private boolean deleted;
    private int deletedContentItems;
    private int deletedObjects;
}