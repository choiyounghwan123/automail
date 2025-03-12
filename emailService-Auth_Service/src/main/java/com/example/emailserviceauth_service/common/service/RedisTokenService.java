package com.example.emailserviceauth_service.common.service;

import com.example.emailserviceauth_service.user.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisTokenService {
    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${jwt.refresh-token-expire-time}")
    private long refreshTokenExpireTime;

    public void saveRefreshToken(String email,String refreshToken){
        redisTemplate.opsForValue().set(email,refreshToken,refreshTokenExpireTime, TimeUnit.MILLISECONDS);
    }

    public String getRefreshToken(String email){
        Object token = redisTemplate.opsForValue().get(email);
        return token != null ? token.toString() :  null;
    }

    public void addToBlacklist(String token, long expirationTime){
        redisTemplate.opsForValue().set("blacklist:" + token,"true",expirationTime,TimeUnit.MILLISECONDS);
    }

    public void deleteRefreshToken(String email){
        redisTemplate.delete(email);
    }

    public boolean isTokenBlacklisted(String token){
        return redisTemplate.opsForValue().get("blacklist:" + token) != null;
    }

}
