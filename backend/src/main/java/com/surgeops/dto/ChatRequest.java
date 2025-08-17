package com.surgeops.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request body for chat endpoint.
 */
public class ChatRequest {
    @NotBlank
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}