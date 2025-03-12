package com.example.emailserviceauth_service.user.service;

import com.example.emailserviceauth_service.user.client.UserClient;
import com.example.emailserviceauth_service.user.dto.LoginRequestDto;
import com.example.emailserviceauth_service.user.dto.TokenResponse;
import com.example.emailserviceauth_service.user.dto.UserResponse;
import com.example.emailserviceauth_service.user.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserClient userClient;


    public TokenResponse login(LoginRequestDto requestDto){

        UserResponse user= userClient.getUserByEmail(requestDto.getEmail());

        if (!passwordEncoder.matches(requestDto.getPassword(),user.getPassword())){
            throw new IllegalStateException("비밀번호가 일치하지 않습니다.");
        }

        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return new TokenResponse(accessToken,refreshToken);


    }
}
