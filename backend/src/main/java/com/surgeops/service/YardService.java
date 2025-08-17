package com.surgeops.service;

import com.surgeops.dto.YardBlockDto;
import com.surgeops.entity.ContainerMove;
import com.surgeops.entity.YardBlock;
import com.surgeops.entity.YardBlockStatus;
import com.surgeops.entity.YardUtilizationHistory;
import com.surgeops.repo.ContainerMoveRepository;
import com.surgeops.repo.YardBlockRepository;
import com.surgeops.repo.YardUtilizationHistoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for yard operations such as listing blocks, moving containers and retrieving utilisation history.
 */
@Service
public class YardService {
    private final YardBlockRepository yardBlockRepository;
    private final YardUtilizationHistoryRepository historyRepository;
    private final ContainerMoveRepository containerMoveRepository;

    public YardService(YardBlockRepository yardBlockRepository,
                       YardUtilizationHistoryRepository historyRepository,
                       ContainerMoveRepository containerMoveRepository) {
        this.yardBlockRepository = yardBlockRepository;
        this.historyRepository = historyRepository;
        this.containerMoveRepository = containerMoveRepository;
    }

    /**
     * Retrieve all yard blocks with derived utilisation metrics.
     */
    public List<YardBlockDto> getYardBlocks() {
        return yardBlockRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieve utilisation history for the last 36 hours. Results are ordered ascending by time.
     */
    public List<YardUtilizationHistory> getUtilizationHistory() {
        Instant since = Instant.now().minusSeconds(36 * 3600);
        List<YardUtilizationHistory> histories = historyRepository.findByTimeAfterOrderByTimeAsc(since);
        if (histories.isEmpty()) {
            return historyRepository.findAllByOrderByTimeAsc();
        }
        return histories;
    }

    /**
     * Move a given amount of TEU from one block to another. Updates counts, persists move and history.
     *
     * @param from from block code
     * @param to   target block code
     * @param teu  amount of TEU to move
     */
    @Transactional
    public void moveContainers(String from, String to, int teu) {
        Assert.isTrue(teu > 0, "TEU must be positive");
        YardBlock fromBlock = yardBlockRepository.findByCode(from)
                .orElseThrow(() -> new IllegalArgumentException("From block not found: " + from));
        YardBlock toBlock = yardBlockRepository.findByCode(to)
                .orElseThrow(() -> new IllegalArgumentException("To block not found: " + to));

        // Adjust counts; prevent negative values
        int newFromCount = Math.max(0, fromBlock.getCurrentCount() - teu);
        fromBlock.setCurrentCount(newFromCount);
        int newToCount = toBlock.getCurrentCount() + teu;
        toBlock.setCurrentCount(newToCount);

        // Update status based on utilisation thresholds
        updateStatus(fromBlock);
        updateStatus(toBlock);

        yardBlockRepository.save(fromBlock);
        yardBlockRepository.save(toBlock);

        // Log the move
        ContainerMove move = ContainerMove.builder()
                .moveId(UUID.randomUUID())
                .fromBlock(from)
                .toBlock(to)
                .teu(teu)
                .ts(Instant.now())
                .build();
        containerMoveRepository.save(move);

        // Append a new utilisation snapshot
        double overallUtil = yardBlockRepository.findAll().stream()
                .mapToDouble(YardBlock::getUtilization)
                .average()
                .orElse(0.0);
        YardUtilizationHistory history = YardUtilizationHistory.builder()
                .id(UUID.randomUUID())
                .time(Instant.now())
                .utilization(overallUtil)
                .threshold(95.0)
                .build();
        historyRepository.save(history);
    }

    private void updateStatus(YardBlock block) {
        double util = block.getUtilization();
        if (util >= 95.0) {
            block.setStatus(YardBlockStatus.critical);
        } else if (util >= 80.0) {
            block.setStatus(YardBlockStatus.warning);
        } else {
            block.setStatus(YardBlockStatus.normal);
        }
    }

    private YardBlockDto toDto(YardBlock block) {
        return new YardBlockDto(
                block.getId(),
                block.getCode(),
                block.getCategory() != null ? block.getCategory().name() : null,
                block.getCapacity(),
                block.getCurrentCount(),
                Math.round(block.getUtilization() * 10.0) / 10.0,
                block.getStatus() != null ? block.getStatus().name() : null
        );
    }
}