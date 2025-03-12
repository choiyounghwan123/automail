package com.example.userservice.user.controller;

import com.example.userservice.user.dto.ApiResponse;
import com.example.userservice.user.dto.SignupRequestDto;
import com.example.userservice.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/")
public class AuthController {
    private final UserService userService;

    @PostMapping("/signup")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<String>> signup(@Valid @RequestBody SignupRequestDto requestDto){
        userService.signup(requestDto);
        ApiResponse<String> response = new ApiResponse<>(true,"회원가입 성공", null);
        return ResponseEntity.ok(response);
    }

}
