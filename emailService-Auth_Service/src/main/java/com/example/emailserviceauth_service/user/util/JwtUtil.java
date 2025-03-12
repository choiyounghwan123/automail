package com.example.emailserviceauth_service.user.util;

import com.example.emailserviceauth_service.common.service.RedisTokenService;
import com.example.emailserviceauth_service.user.dto.UserResponse;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey accessSecretKey;
    private final SecretKey refreshSecretKey;
    private final long accessTokenExpireTime;
    private final long refreshTokenExpireTime;
    private final RedisTokenService redisTokenService;

    public JwtUtil(
            @Value("${jwt.secret-key.access-token}") String accessSecret,
            @Value("${jwt.secret-key.refresh-token}") String refreshToken,
            @Value("${jwt.access-token-expire-time}") long accessTokenExpireTime,
            @Value("${jwt.refresh-token-expire-time}") long refreshTokenExpireTime,
            RedisTokenService redisTokenService){
        this.accessSecretKey = new SecretKeySpec(Base64.getDecoder().decode(accessSecret), "HmacSHA256");
        this.refreshSecretKey = new SecretKeySpec(Base64.getDecoder().decode(refreshToken), "HmacSHA256");
        this.accessTokenExpireTime = accessTokenExpireTime;
        this.refreshTokenExpireTime = refreshTokenExpireTime;
        this.redisTokenService = redisTokenService;
    }

    public String generateAccessToken(UserResponse user){
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpireTime))
                .signWith(accessSecretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(UserResponse user){
        String refreshToken =  Jwts.builder()
                .setSubject(user.getEmail())
                .claim("active",user.getIsActive())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpireTime))
                .signWith(refreshSecretKey, SignatureAlgorithm.HS256)
                .compact();
        redisTokenService.saveRefreshToken(user.getEmail(),refreshToken);
        return refreshToken;
    }

    public boolean validateToken(String token, boolean isAccessToken){
        try {
            SecretKey key = isAccessToken ? accessSecretKey:refreshSecretKey;
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        }catch (Exception e){
            return false;
        }
    }

    public long getRemainningExpirationTime(String token, boolean isAccessToken){
        SecretKey key = isAccessToken ? accessSecretKey:refreshSecretKey;

        Date expiration = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.getTime() - System.currentTimeMillis();
    }

    public String extractEmail(String token, boolean isAccessToken){
        SecretKey key = isAccessToken ? accessSecretKey : refreshSecretKey;
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
