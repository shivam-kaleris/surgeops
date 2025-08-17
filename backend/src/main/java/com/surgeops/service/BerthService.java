package com.surgeops.service;

import com.surgeops.dto.BerthAssignmentDto;
import com.surgeops.dto.BerthDto;
import com.surgeops.dto.VesselDto;
import com.surgeops.entity.Berth;
import com.surgeops.entity.BerthAssignment;
import com.surgeops.entity.Vessel;
import com.surgeops.repo.BerthAssignmentRepository;
import com.surgeops.repo.BerthRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for retrieving berth status and associated assignments.
 */
@Service
public class BerthService {

    private final BerthRepository berthRepository;
    private final BerthAssignmentRepository assignmentRepository;

    public BerthService(BerthRepository berthRepository, BerthAssignmentRepository assignmentRepository) {
        this.berthRepository = berthRepository;
        this.assignmentRepository = assignmentRepository;
    }

    /**
     * List all berths and include their current assignments.
     *
     * @return list of BerthDto objects
     */
    public List<BerthDto> getBerths() {
        return berthRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private BerthDto toDto(Berth berth) {
        List<BerthAssignment> assignments = assignmentRepository.findByBerth_Code(berth.getCode());
        List<BerthAssignmentDto> assignmentDtos = assignments.stream().map(this::toAssignmentDto).collect(Collectors.toList());
        return new BerthDto(
                berth.getBerthId(),
                berth.getCode(),
                berth.getStatus() != null ? berth.getStatus().name() : null,
                assignmentDtos
        );
    }

    private BerthAssignmentDto toAssignmentDto(BerthAssignment assignment) {
        Vessel vessel = assignment.getVessel();
        VesselDto vesselDto = null;
        if (vessel != null) {
            vesselDto = new VesselDto(
                    vessel.getVesselId(),
                    vessel.getName(),
                    vessel.getImo(),
                    vessel.getExpectedTeu(),
                    VesselDto.formatInstant(vessel.getEta()),
                    vessel.getStatus() != null ? vessel.getStatus().name() : null
            );
        }
        return new BerthAssignmentDto(
                assignment.getAssignmentId(),
                assignment.getBerth() != null ? assignment.getBerth().getCode() : null,
                vesselDto,
                BerthAssignmentDto.formatInstant(assignment.getPlannedStart()),
                BerthAssignmentDto.formatInstant(assignment.getPlannedEnd()),
                BerthAssignmentDto.formatInstant(assignment.getActualStart()),
                BerthAssignmentDto.formatInstant(assignment.getActualEnd())
        );
    }
}