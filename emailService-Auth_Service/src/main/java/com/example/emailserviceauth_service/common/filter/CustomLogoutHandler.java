package com.example.emailserviceauth_service.common.filter;

import com.example.emailserviceauth_service.common.service.RedisTokenService;
import com.example.emailserviceauth_service.user.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomLogoutHandler implements LogoutHandler {

    private final JwtUtil jwtUtil;
    private final RedisTokenService redisTokenService;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer")){
            String token = header.substring(7);
            if(jwtUtil.validateToken(token,true)){
                redisTokenService.addToBlacklist(token,jwtUtil.getRemainningExpirationTime(token,true));
            }
        }
    }
}
