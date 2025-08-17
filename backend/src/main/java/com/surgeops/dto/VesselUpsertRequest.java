package com.surgeops.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * Request body for creating or updating a vessel via the /vessels endpoint.
 */
public class VesselUpsertRequest {
    private UUID vesselId;
    @NotBlank
    private String name;
    private String imo;
    @NotNull
    private Integer expectedTeu;
    @NotBlank
    private String eta;
    @NotBlank
    private String status;

    public UUID getVesselId() {
        return vesselId;
    }
    public void setVesselId(UUID vesselId) {
        this.vesselId = vesselId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getImo() {
        return imo;
    }
    public void setImo(String imo) {
        this.imo = imo;
    }
    public Integer getExpectedTeu() {
        return expectedTeu;
    }
    public void setExpectedTeu(Integer expectedTeu) {
        this.expectedTeu = expectedTeu;
    }
    public String getEta() {
        return eta;
    }
    public void setEta(String eta) {
        this.eta = eta;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}