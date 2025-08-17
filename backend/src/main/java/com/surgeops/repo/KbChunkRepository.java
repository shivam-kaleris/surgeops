package com.surgeops.repo;

import com.surgeops.entity.KbChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface KbChunkRepository extends JpaRepository<KbChunk, UUID> {

    /**
     * Returns the top n chunks ordered by similarity between their embedding and the given vector.
     * The parameter must be formatted as a Postgres vector literal, e.g. '[0.1,0.2,0.3]'.
     *
     * Note: this query uses the pgvector operator <=> (Euclidean distance).
     *
     * @param embedding vector literal string
     * @param limit maximum number of results
     * @return list of KbChunk records
     */
    @Query(value = "SELECT * FROM kb_chunks ORDER BY embedding <=> CAST(:embedding AS vector) LIMIT :limit", nativeQuery = true)
    List<KbChunk> findNearest(@Param("embedding") String embedding, @Param("limit") int limit);
}