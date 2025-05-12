package com.example.userservice.user.service;

import com.example.userservice.user.dto.EmailVerificationTokenDto;
import com.example.userservice.user.entity.EmailVerificationToken;
import com.example.userservice.user.entity.User;
import com.example.userservice.user.repository.EmailVerificationTokenRepository;
import com.example.userservice.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {
    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;

    @KafkaListener(topics = "email-verification-tokens", groupId = "email-verification-group")
    @Transactional
    public void handleEmailVerificationToken(EmailVerificationTokenDto tokenDto) {
        User user = userRepository.findByEmail(tokenDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 기존 토큰이 있다면 삭제
        tokenRepository.findByUserEmail(tokenDto.getEmail())
                .ifPresent(tokenRepository::delete);

        // 새 토큰 생성
        EmailVerificationToken token = new EmailVerificationToken(user, tokenDto.getToken());
        tokenRepository.save(token);
    }
} 