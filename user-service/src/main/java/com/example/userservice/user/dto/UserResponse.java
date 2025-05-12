package com.example.userservice.user.dto;

import com.example.userservice.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    String email;
    String password;
    Role role;
    Boolean isActive;
}
