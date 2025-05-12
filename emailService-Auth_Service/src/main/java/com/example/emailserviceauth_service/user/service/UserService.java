package com.example.emailserviceauth_service.user.service;

import com.example.emailserviceauth_service.user.client.UserClient;
import com.example.emailserviceauth_service.user.dto.LoginRequestDto;
import com.example.emailserviceauth_service.user.dto.TokenResponse;
import com.example.emailserviceauth_service.user.dto.UserResponse;
import com.example.emailserviceauth_service.user.util.JwtUtil;
import com.example.emailserviceauth_service.common.exception.EmailNotVerifiedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import feign.FeignException;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserClient userClient;

    public TokenResponse login(LoginRequestDto requestDto) {
        log.info("Login attempt for email: {}", requestDto.getEmail());
        
        try {
            // 1. 사용자 조회
            UserResponse user;
            try {
                user = userClient.getUserByEmail(requestDto.getEmail());
                log.debug("User found: email={}, isActive={}, role={}", 
                    user.getEmail(), user.getIsActive(), user.getRole());
            } catch (FeignException.NotFound e) {
                log.warn("User not found for email: {}", requestDto.getEmail());
                throw new IllegalStateException("존재하지 않는 이메일입니다.");
            } catch (FeignException e) {
                log.error("Failed to fetch user data: {}", e.getMessage());
                throw new IllegalStateException("사용자 정보를 가져오는데 실패했습니다.");
            }

            // 2. 비밀번호 검증
            if (!passwordEncoder.matches(requestDto.getPassword(), user.getPassword())) {
                log.warn("Invalid password for email: {}", requestDto.getEmail());
                throw new IllegalStateException("비밀번호가 일치하지 않습니다.");
            }

            // 3. 이메일 인증 여부 체크
            if (user.getIsActive() == null) {
                log.warn("isActive is null for user: {}", requestDto.getEmail());
                throw new EmailNotVerifiedException("이메일 인증이 필요합니다. 이메일을 확인해주세요.");
            }
            
            if (!user.getIsActive()) {
                log.warn("Email not verified for user: {}, isActive={}", 
                    requestDto.getEmail(), user.getIsActive());
                throw new EmailNotVerifiedException("이메일 인증이 필요합니다. 이메일을 확인해주세요.");
            }

            // 4. 토큰 생성
            try {
                String accessToken = jwtUtil.generateAccessToken(user);
                String refreshToken = jwtUtil.generateRefreshToken(user);
                log.info("Login successful for email: {}", requestDto.getEmail());
                return new TokenResponse(accessToken, refreshToken);
            } catch (Exception e) {
                log.error("Token generation failed for user: {}, error: {}", 
                    requestDto.getEmail(), e.getMessage(), e);
                throw new IllegalStateException("토큰 생성에 실패했습니다.");
            }
        } catch (EmailNotVerifiedException e) {
            log.warn("Email verification required: {}", e.getMessage());
            throw e;
        } catch (IllegalStateException e) {
            log.warn("Login failed: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during login for email: {}, error: {}", 
                requestDto.getEmail(), e.getMessage(), e);
            throw new IllegalStateException("로그인 처리 중 오류가 발생했습니다.");
        }
    }
}
