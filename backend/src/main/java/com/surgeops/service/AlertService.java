package com.surgeops.service;

import com.surgeops.dto.AlertDto;
import com.surgeops.entity.Alert;
import com.surgeops.repo.AlertRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for reading and acknowledging alerts.
 */
@Service
public class AlertService {
    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    /**
     * List alerts optionally filtered by a timestamp. Alerts are ordered in reverse chronological order.
     *
     * @param since optional ISO timestamp to filter alerts created after this instant
     * @return a list of AlertDto objects
     */
    public List<AlertDto> getAlerts(String since) {
        List<Alert> alerts;
        if (since != null && !since.isBlank()) {
            try {
                Instant ts = Instant.parse(since);
                alerts = alertRepository.findByCreatedAtAfterOrderByCreatedAtDesc(ts);
            } catch (DateTimeParseException ex) {
                alerts = alertRepository.findAllByOrderByCreatedAtDesc();
            }
        } else {
            alerts = alertRepository.findAllByOrderByCreatedAtDesc();
        }
        return alerts.stream().map(this::toDto).collect(Collectors.toList());
    }

    /**
     * Acknowledge an alert by setting its acknowledged flag to true.
     *
     * @param id alert identifier
     * @return updated AlertDto if found, otherwise empty
     */
    @Transactional
    public Optional<AlertDto> acknowledgeAlert(UUID id) {
        return alertRepository.findById(id).map(alert -> {
            alert.setAcknowledged(true);
            alertRepository.save(alert);
            return toDto(alert);
        });
    }

    private AlertDto toDto(Alert alert) {
        AlertDto.Suggestion suggestion = null;
        if (alert.getSuggestionAction() != null) {
            suggestion = new AlertDto.Suggestion(
                    alert.getSuggestionAction(),
                    alert.getSuggestionFromBlock(),
                    alert.getSuggestionToBlock(),
                    alert.getSuggestionTeu()
            );
        }
        return new AlertDto(
                alert.getAlertId(),
                alert.getSeverity() != null ? alert.getSeverity().name() : null,
                alert.getMessage(),
                AlertDto.formatInstant(alert.getCreatedAt()),
                Boolean.TRUE.equals(alert.getAcknowledged()),
                suggestion
        );
    }
}