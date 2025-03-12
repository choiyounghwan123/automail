package com.example.userservice.user.service;

import com.example.userservice.user.dto.UserInfoDto;
import com.example.userservice.user.entity.User;
import com.example.userservice.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MypageService {
    private final UserRepository userRepository;

    public UserInfoDto getUserInfo(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserInfoDto dto = new UserInfoDto();
        dto.setEmail(user.getEmail());
        dto.setJoinDate(user.getCreateAt());
        dto.setIsActive(user.getIsActive());

        return dto;
    }
}
