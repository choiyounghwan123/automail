package com.example.userservice.user.controller;

import com.example.userservice.user.dto.ApiResponse;
import com.example.userservice.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final UserService userService;

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam String token) {
        userService.verifyEmail(token);
        return ResponseEntity.ok(new ApiResponse<>(true, "이메일 인증이 완료되었습니다.", null));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Boolean>> checkEmailVerificationStatus(@RequestParam String email) {
        boolean isVerified = userService.isEmailVerified(email);
        return ResponseEntity.ok(new ApiResponse<>(true, isVerified, null));
    }
} 