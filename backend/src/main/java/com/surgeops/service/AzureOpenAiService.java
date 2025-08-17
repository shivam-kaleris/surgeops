package com.surgeops.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;

/**
 * Service for interacting with Azure OpenAI via REST. Supports chat completions and embeddings.
 */
@Service
public class AzureOpenAiService {

    private final String endpoint;
    private final String apiKey;
    private final String apiVersion;
    private final String chatDeployment;
    private final String embeddingsDeployment;
    private final int embeddingDim;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public AzureOpenAiService(@Value("${azure.openai.endpoint:}") String endpoint,
                              @Value("${azure.openai.api-key:}") String apiKey,
                              @Value("${azure.openai.api-version:2024-06-01}") String apiVersion,
                              @Value("${azure.openai.chat-deployment:gpt-4o-mini}") String chatDeployment,
                              @Value("${azure.openai.embeddings-deployment:text-embedding-3-large}") String embeddingsDeployment,
                              @Value("${azure.openai.embedding-dim:1536}") int embeddingDim,
                              WebClient.Builder builder) {
        this.endpoint = endpoint;
        this.apiKey = apiKey;
        this.apiVersion = apiVersion;
        this.chatDeployment = chatDeployment;
        this.embeddingsDeployment = embeddingsDeployment;
        this.embeddingDim = embeddingDim;
        this.webClient = builder.build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Determine if the service is configured with both endpoint and API key.
     */
    public boolean isConfigured() {
        return endpoint != null && !endpoint.isBlank() && apiKey != null && !apiKey.isBlank();
    }

    /**
     * Make a simple chat completion call with a single prompt. The assistant will answer as a summarizer.
     */
    public String simpleChatCompletion(String prompt) {
        if (!isConfigured()) {
            throw new IllegalStateException("Azure OpenAI is not configured");
        }
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", "You are a helpful assistant that summarizes port events."));
        messages.add(Map.of("role", "user", "content", prompt));
        return chatCompletion(messages);
    }

    /**
     * Perform a chat completion request with an arbitrary list of messages. Returns the assistant's reply.
     */
    public String chatCompletion(List<Map<String, String>> messages) {
        if (!isConfigured()) {
            throw new IllegalStateException("Azure OpenAI is not configured");
        }
        return chatCompletionInternal(messages);
    }

    private String chatCompletionInternal(List<Map<String, String>> messages) {
        String url = String.format("%s/openai/deployments/%s/chat/completions?api-version=%s", endpoint, chatDeployment, apiVersion);
        Map<String, Object> body = new HashMap<>();
        body.put("messages", messages);
        body.put("temperature", 0.1);
        body.put("max_tokens", 512);
        return webClient.post()
                .uri(url)
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .map(this::extractAssistantReply)
                .block();
    }

    private String extractAssistantReply(String responseBody) {
        try {
            JsonNode json = objectMapper.readTree(responseBody);
            JsonNode choices = json.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                JsonNode message = choices.get(0).path("message");
                return message.path("content").asText();
            }
        } catch (Exception e) {
            // ignore and fall through
        }
        return "";
    }

    /**
     * Embed a list of input strings. Returns a list of float arrays corresponding to each input.
     */
    public List<float[]> embed(List<String> inputs) {
        if (!isConfigured()) {
            throw new IllegalStateException("Azure OpenAI is not configured");
        }
        String url = String.format("%s/openai/deployments/%s/embeddings?api-version=%s", endpoint, embeddingsDeployment, apiVersion);
        Map<String, Object> body = new HashMap<>();
        body.put("input", inputs);
        return webClient.post()
                .uri(url)
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .map(this::extractEmbeddings)
                .block();
    }

    private List<float[]> extractEmbeddings(String responseBody) {
        try {
            JsonNode json = objectMapper.readTree(responseBody);
            JsonNode dataArray = json.path("data");
            List<float[]> result = new ArrayList<>();
            if (dataArray.isArray()) {
                for (JsonNode item : dataArray) {
                    JsonNode embeddingNode = item.path("embedding");
                    float[] vec = new float[embeddingNode.size()];
                    for (int i = 0; i < embeddingNode.size(); i++) {
                        vec[i] = embeddingNode.get(i).floatValue();
                    }
                    result.add(vec);
                }
            }
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse embeddings response", e);
        }
    }
}