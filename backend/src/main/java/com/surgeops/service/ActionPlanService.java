package com.surgeops.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.surgeops.dto.ActionPlanDto;
import com.surgeops.entity.ActionPlan;
import com.surgeops.entity.ActionPlanStatus;
import com.surgeops.entity.Surge;
import com.surgeops.repo.ActionPlanRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Service responsible for generating and persisting action plans using Azure OpenAI. Falls back
 * to deterministic plans if the LLM is not configured or errors occur.
 */
@Service
public class ActionPlanService {

    private final AzureOpenAiService azureOpenAiService;
    private final ActionPlanRepository actionPlanRepository;
    private final ObjectMapper objectMapper;

    public ActionPlanService(AzureOpenAiService azureOpenAiService, ActionPlanRepository actionPlanRepository) {
        this.azureOpenAiService = azureOpenAiService;
        this.actionPlanRepository = actionPlanRepository;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Generate a JSON action plan for a surge, persist it and return the created entity.
     *
     * @param surge the surge to generate a plan for
     * @return persisted ActionPlan
     */
    @Transactional
    public ActionPlan generateAndPersistPlan(Surge surge) {
        String payload;
        if (azureOpenAiService.isConfigured()) {
            try {
                String system = "You are SurgeOps Action Plan generator. " +
                        "Generate a JSON object with keys: id, title, severity, estimatedTime, impact, description, steps, resourcesRequired, beforeData, afterData. " +
                        "Do not include any explanatory text.";
                String user = "Metrics: " + surge.getMetrics() + ", reason: " + surge.getReason();
                var messages = java.util.List.of(
                        Map.of("role", "system", "content", system),
                        Map.of("role", "user", "content", user)
                );
                String reply = azureOpenAiService.chatCompletion(messages);
                // Validate that reply is JSON
                JsonNode node = objectMapper.readTree(reply.trim());
                payload = node.toString();
            } catch (Exception e) {
                payload = fallbackPlanPayload(surge);
            }
        } else {
            payload = fallbackPlanPayload(surge);
        }
        ActionPlan plan = ActionPlan.builder()
                .planId(UUID.randomUUID())
                .surge(surge)
                .generatedAt(Instant.now())
                .status(ActionPlanStatus.ready)
                .payload(payload)
                .build();
        return actionPlanRepository.save(plan);
    }

    /**
     * Retrieve an action plan for a given surge. Returns the most recently generated plan.
     */
    public Optional<ActionPlan> getPlanForSurge(UUID surgeId) {
        return actionPlanRepository.findTopBySurge_SurgeIdOrderByGeneratedAtDesc(surgeId);
    }

    public ActionPlanDto toDto(ActionPlan plan) {
        return new ActionPlanDto(
                plan.getPlanId(),
                plan.getSurge() != null ? plan.getSurge().getSurgeId() : null,
                ActionPlanDto.formatInstant(plan.getGeneratedAt()),
                plan.getStatus() != null ? plan.getStatus().name() : null,
                plan.getPayload()
        );
    }

    private String fallbackPlanPayload(Surge surge) {
        try {
            ObjectNode root = objectMapper.createObjectNode();
            root.put("id", surge.getSurgeId() != null ? surge.getSurgeId().toString() : UUID.randomUUID().toString());
            root.put("title", "Default Action Plan");
            root.put("severity", "Medium");
            root.put("estimatedTime", "2h");
            root.put("impact", "Medium");
            root.put("description", "Balance yard utilisation by moving containers and adjusting berth assignments.");
            root.putArray("steps").add("Identify overloaded blocks").add("Prepare transport equipment").add("Relocate containers");
            root.putArray("resourcesRequired").add("Trucks").add("Personnel");
            root.set("beforeData", objectMapper.createObjectNode());
            root.set("afterData", objectMapper.createObjectNode());
            return root.toString();
        } catch (Exception e) {
            return "{}";
        }
    }
}