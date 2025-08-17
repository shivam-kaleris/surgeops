package com.surgeops.service;

import com.surgeops.entity.KbChunk;
import com.surgeops.repo.KbChunkRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * Service responsible for vector retrieval from the knowledge base using pgvector. It embeds
 * queries via Azure OpenAI and queries the kb_chunks table for nearest neighbours.
 */
@Service
public class RagService {

    private final KbChunkRepository kbChunkRepository;
    private final AzureOpenAiService azureOpenAiService;
    private final int embeddingDim;

    public RagService(KbChunkRepository kbChunkRepository,
                      AzureOpenAiService azureOpenAiService,
                      @Value("${azure.openai.embedding-dim:1536}") int embeddingDim) {
        this.kbChunkRepository = kbChunkRepository;
        this.azureOpenAiService = azureOpenAiService;
        this.embeddingDim = embeddingDim;
    }

    /**
     * Retrieve the top k chunks similar to the provided query using vector search. If the LLM is not
     * configured the result will be empty.
     *
     * @param query question or statement
     * @param k     number of chunks to return
     * @return list of similar chunks (may be empty)
     */
    public List<KbChunk> retrieveSimilarChunks(String query, int k) {
        if (!azureOpenAiService.isConfigured()) {
            return List.of();
        }
        List<float[]> embeddings = azureOpenAiService.embed(List.of(query));
        if (embeddings.isEmpty()) {
            return List.of();
        }

        float[] vector = embeddings.get(0);

        // Truncate or pad to exactly embeddingDim
        float[] fixed = new float[embeddingDim];
        int copyLen = Math.min(vector.length, embeddingDim);
        System.arraycopy(vector, 0, fixed, 0, copyLen);
        // remaining entries are already 0.0f by default

        String literal = toVectorLiteral(fixed);
        return kbChunkRepository.findNearest(literal, k);
    }

    // Build a pgvector literal like: [0.12,0.34,...]
    private String toVectorLiteral(float[] vec) {
        String csv = IntStream.range(0, vec.length)
                .mapToObj(i -> Float.toString(vec[i]))
                .collect(Collectors.joining(","));
        return "[" + csv + "]";
    }
}