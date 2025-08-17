package com.surgeops.service;

import com.surgeops.dto.EventDto;
import com.surgeops.entity.Event;
import com.surgeops.repo.EventRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for listing events and producing LLM summaries.
 */
@Service
public class EventService {
    private final EventRepository eventRepository;
    private final AzureOpenAiService azureOpenAiService;

    public EventService(EventRepository eventRepository, AzureOpenAiService azureOpenAiService) {
        this.eventRepository = eventRepository;
        this.azureOpenAiService = azureOpenAiService;
    }

    /**
     * Returns events ordered by most recent first.
     */
    public List<EventDto> getEvents() {
        List<Event> events = eventRepository.findAllByOrderByCreatedAtDesc();
        return events.stream().map(event -> new EventDto(
                event.getEventId(),
                event.getType() != null ? event.getType().name() : null,
                event.getMessage(),
                EventDto.formatInstant(event.getCreatedAt()),
                event.getSeverity() != null ? event.getSeverity().name() : null
        )).collect(Collectors.toList());
    }

    /**
     * Produce a summary of recent events using the LLM. If the LLM is not configured
     * the messages are concatenated as a deterministic fallback.
     *
     * @return summary text
     */
    @Transactional
    public String summarizeRecentEvents() {
        List<Event> events = eventRepository.findAllByOrderByCreatedAtDesc();
        // Limit to last N events
        int max = Math.min(events.size(), 10);
        List<Event> latest = events.subList(0, max);
        String concatenated = latest.stream()
                .map(e -> String.format("[%s] %s: %s", e.getSeverity(), e.getType(), e.getMessage()))
                .collect(Collectors.joining("\n"));
        // Use LLM if available
        if (azureOpenAiService.isConfigured()) {
            try {
                String prompt = "Summarize the following port events concisely:" + "\n" + concatenated;
                return azureOpenAiService.simpleChatCompletion(prompt);
            } catch (Exception e) {
                // fall back to concatenated summary
            }
        }
        return concatenated;
    }
}