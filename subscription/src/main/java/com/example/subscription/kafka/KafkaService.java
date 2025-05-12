package com.example.subscription.kafka;

import com.example.subscription.kafka.dto.EmailNotificationRequest;
import com.example.subscription.kafka.dto.Notice;
import com.example.subscription.subscription.entity.Subscription;
import com.example.subscription.subscription.repository.SubscriptionRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@KafkaListener(topics = "notices", groupId = "subscription-group")
@RequiredArgsConstructor
@Slf4j
public class KafkaService {
    private final SubscriptionRepository subscriptionRepository;
    private final KafkaTemplate<String, EmailNotificationRequest> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String EMAIL_TOPIC = "email-notifications";

    @KafkaHandler
    public void handleNotice(String noticeJson) throws JsonProcessingException {
        log.info("Received message from notices topic: {}", noticeJson);
        try {
            Notice notice = parseNotice(noticeJson);
            if (notice == null) {
                log.warn("Received invalid notice: {}", noticeJson);
                return;
            }
            log.info("Parsed notice successfully: title={}", notice.getTitle());
            List<String> recipients = getSubscribers();
            if (sendToEmailService(notice, recipients)) {
                log.info("Sent email notification request to Kafka: title={}, recipients={}", notice.getTitle(), recipients);
            } else {
                log.error("Failed to send email notification request to Kafka: title={}, recipients={}", notice.getTitle(), recipients);
            }
        } catch (Exception e) {
            log.error("Failed to process notice: {}, error: {}", noticeJson, e.getMessage(), e);
        }
    }

    private Notice parseNotice(String noticeJson) {
        try {
            log.debug("Parsing notice JSON: {}", noticeJson);
            Notice notice = objectMapper.readValue(noticeJson, Notice.class);
            if (notice.getTitle() == null || notice.getTitle().isEmpty()) {
                log.warn("Notice title is null or empty: {}", noticeJson);
                return null;
            }
            return notice;
        } catch (JsonProcessingException e) {
            log.error("Failed to parse notice JSON: {}, error: {}", noticeJson, e.getMessage(), e);
            return null;
        }
    }

    private List<String> getSubscribers() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        return subscriptions.stream()
                .map(Subscription::getEmail)
                .collect(Collectors.toList());
    }

    private boolean sendToEmailService(Notice notice, List<String> recipients) {
        try {
            EmailNotificationRequest request = new EmailNotificationRequest(notice, recipients);
            CompletableFuture<SendResult<String, EmailNotificationRequest>> future = kafkaTemplate.send(EMAIL_TOPIC, request);

            // 동기적으로 결과를 기다림 (타임아웃 5초)
            SendResult<String, EmailNotificationRequest> result = future.get(5, TimeUnit.SECONDS);

            log.debug("Sent to Kafka topic: {} title: {}, offset: {}",
                    EMAIL_TOPIC, notice.getTitle(), result.getRecordMetadata().offset());
            return true;
        } catch (Exception e) {
            log.error("Failed to send to Kafka topic '{}' : {}, error: {}",
                    EMAIL_TOPIC, notice.getTitle(), e.getMessage(), e);
            return false;
        }
    }
}