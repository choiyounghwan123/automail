package com.example.emailserviceauth_service.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponse {
    private String email;
    private String password;
    private String role;
    private Boolean isActive;
}
