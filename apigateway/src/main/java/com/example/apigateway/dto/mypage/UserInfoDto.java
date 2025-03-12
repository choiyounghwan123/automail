package com.example.apigateway.dto.mypage;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserInfoDto {
    private String email;
    private LocalDateTime joinDate;
    private Boolean isActive;
}
