package com.edumanagepro.dto.response;

import com.edumanagepro.entity.Announcement;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Getter @Setter
public class AdminAnnouncementResponse {
    private UUID id;
    private String title;
    private String message;
    private Date createdAt;

    public static AdminAnnouncementResponse from(Announcement a) {
        AdminAnnouncementResponse r = new AdminAnnouncementResponse();
        r.setId(a.getId());
        r.setTitle(a.getTitle());
        r.setMessage(a.getMessage());
        r.setCreatedAt(Date.from(a.getCreatedAt()));
        return r;
    }
}