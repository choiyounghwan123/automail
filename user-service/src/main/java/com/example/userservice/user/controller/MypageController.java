package com.example.userservice.user.controller;

import com.example.userservice.user.dto.ApiResponse;
import com.example.userservice.user.dto.UserInfoDto;
import com.example.userservice.user.service.MypageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/users/mypage")
public class MypageController {
    private final MypageService mypageService;

    @GetMapping
    public ResponseEntity<UserInfoDto> getUserInfo(){
        UserInfoDto userInfo = mypageService.getUserInfo();
        return ResponseEntity.ok(userInfo);
    }
}
