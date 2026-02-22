package com.edumanagepro.dto.response;

import jdk.jshell.Snippet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AdminStudentOptionResponse {
    private UUID id;
    private String name;
    private String email;
    private String profilePhotoKey; // nullable
}