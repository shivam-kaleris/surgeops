package com.surgeops.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request body for moving containers between yard blocks.
 */
public class MoveRequest {
    @NotBlank
    private String from;
    @NotBlank
    private String to;
    @NotNull
    @Min(1)
    private Integer teu;

    public String getFrom() {
        return from;
    }
    public void setFrom(String from) {
        this.from = from;
    }
    public String getTo() {
        return to;
    }
    public void setTo(String to) {
        this.to = to;
    }
    public Integer getTeu() {
        return teu;
    }
    public void setTeu(Integer teu) {
        this.teu = teu;
    }
}