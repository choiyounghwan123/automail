package com.example.emailserviceauth_service.user.controller;

import com.example.emailserviceauth_service.common.dto.ApiResponse;
import com.example.emailserviceauth_service.user.dto.LoginRequestDto;
import com.example.emailserviceauth_service.user.dto.TokenResponse;
import com.example.emailserviceauth_service.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("login")
    public ResponseEntity<ApiResponse<TokenResponse>> login(@Valid @RequestBody LoginRequestDto loginRequestDto){
        TokenResponse tokenResponse = userService.login(loginRequestDto);
        return ResponseEntity.ok(new ApiResponse<>(true, tokenResponse,null));

    }
}
