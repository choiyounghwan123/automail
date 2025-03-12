package com.example.apigateway.dto.mypage;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MypageResponseDto {
    private String email;
    private LocalDateTime createdAt;
    private Boolean isActive;
    private boolean subscribed;
}
