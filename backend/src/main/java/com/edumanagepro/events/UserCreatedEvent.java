package com.edumanagepro.events;

import org.springframework.context.event.EventListener;

import java.util.UUID;

public record UserCreatedEvent(UUID userId, String plainPassword) {}