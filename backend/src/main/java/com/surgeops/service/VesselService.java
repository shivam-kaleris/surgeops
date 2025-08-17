package com.surgeops.service;

import com.surgeops.dto.VesselDto;
import com.surgeops.dto.VesselUpsertRequest;
import com.surgeops.entity.Vessel;
import com.surgeops.entity.VesselStatus;
import com.surgeops.repo.VesselRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for creating and updating vessels. Triggers surge detection after persisting changes.
 */
@Service
public class VesselService {

    private final VesselRepository vesselRepository;
    private final SurgeDetectionService surgeDetectionService;

    public VesselService(VesselRepository vesselRepository, SurgeDetectionService surgeDetectionService) {
        this.vesselRepository = vesselRepository;
        this.surgeDetectionService = surgeDetectionService;
    }

    /**
     * Insert or update a vessel record. If the vessel has no ID but an IMO or name matches an existing record,
     * that record is updated. Otherwise a new vessel is created. After commit, surge detection runs.
     *
     * @param req upsert request
     * @return VesselDto of the persisted vessel
     */
    @Transactional
    public VesselDto upsert(VesselUpsertRequest req) {
        Vessel vessel;
        if (req.getVesselId() != null) {
            vessel = vesselRepository.findById(req.getVesselId()).orElse(new Vessel());
        } else if (req.getImo() != null && !req.getImo().isBlank()) {
            vessel = vesselRepository.findByImo(req.getImo()).orElse(new Vessel());
        } else {
            vessel = vesselRepository.findByName(req.getName()).orElse(new Vessel());
        }
        if (vessel.getVesselId() == null) {
            vessel.setVesselId(UUID.randomUUID());
        }
        vessel.setName(req.getName());
        vessel.setImo(req.getImo());
        vessel.setExpectedTeu(req.getExpectedTeu());
        try {
            vessel.setEta(Instant.parse(req.getEta()));
        } catch (DateTimeParseException e) {
            vessel.setEta(null);
        }
        // Map status string to enum
        try {
            vessel.setStatus(VesselStatus.valueOf(req.getStatus()));
        } catch (Exception e) {
            vessel.setStatus(null);
        }
        vesselRepository.save(vessel);
        // After commit, run surge detection
        surgeDetectionService.evaluateAndHandle();
        return toDto(vessel);
    }

    private VesselDto toDto(Vessel vessel) {
        return new VesselDto(
                vessel.getVesselId(),
                vessel.getName(),
                vessel.getImo(),
                vessel.getExpectedTeu(),
                vessel.getEta() != null ? VesselDto.formatInstant(vessel.getEta()) : null,
                vessel.getStatus() != null ? vessel.getStatus().name() : null
        );
    }
}