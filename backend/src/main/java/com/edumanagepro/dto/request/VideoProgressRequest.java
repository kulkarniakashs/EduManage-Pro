package com.edumanagepro.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VideoProgressRequest {
    private int currentSeconds;
    private int durationSeconds; // if ContentItem.durationSeconds exists you can ignore this
}