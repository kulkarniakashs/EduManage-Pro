package com.edumanagepro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "institutes",
        uniqueConstraints = @UniqueConstraint(name = "uk_institute_code", columnNames = "code"))
@Getter @Setter
public class Institute extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(length = 500)
    private String address;
}
