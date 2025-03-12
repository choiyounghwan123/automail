package com.example.userservice.user.rabbitMQ;

import com.example.userservice.config.RabbitMQConfig;
import com.example.userservice.user.rabbitMQ.dto.MessageEmailDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RabbitMQProducer {
    private final RabbitTemplate rabbitTemplate;

    public void sendEmailVerificationMessage(MessageEmailDto emailDto){
        // Celery 메시지 구조 생성
        Map<String, Object> messageMap = new HashMap<>();
        messageMap.put("id", UUID.randomUUID().toString());  // 유니크한 작업 ID
        messageMap.put("task", "emails.tasks.send_verification_email");  // Celery 작업 이름
        messageMap.put("args", new String[]{emailDto.getEmail()});  // 작업 인자
        messageMap.put("kwargs", new HashMap<>());  // 추가 인자
        messageMap.put("retries", 0);  // 재시도 횟수
        messageMap.put("eta", null);  // ETA
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonMessage = objectMapper.writeValueAsString(messageMap);

            MessageProperties messageProperties = new MessageProperties();
            messageProperties.setContentType("application/json");
            Message message = new Message(jsonMessage.getBytes(), messageProperties);

            rabbitTemplate.convertAndSend(RabbitMQConfig.QUEUE_NAME,message);
            System.out.println("Message sent to Queue: " + emailDto.getEmail() + jsonMessage);
        }catch (Exception e){
            System.err.println("Failed to send message: " + e.getMessage());
        }

    }
}
