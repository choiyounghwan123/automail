package com.example.apigateway.kafka;

import org.springframework.kafka.support.SendResult;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class KafkaProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessage(String topic, String message){
        CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(topic,message);

        future.thenAccept(result ->{
            System.out.println("Message sent to topic: " + topic +", Offset: " + result.getRecordMetadata().offset());
        }).exceptionally(ex ->{
           System.err.println("Failed to send message: " + ex.getMessage());
           return null;
        });
    }
}
