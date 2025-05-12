package com.example.userservice.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerificationTokenDto {
    private String email;
    private String token;
    private LocalDateTime expiresAt;
} 