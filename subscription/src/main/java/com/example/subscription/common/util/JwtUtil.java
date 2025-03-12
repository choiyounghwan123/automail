package com.example.subscription.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Component
public class JwtUtil {
    private final SecretKey accessSecretkey;

    public JwtUtil(@Value("${jwt.secret-key.access-token}") String accessSecret) {
        this.accessSecretkey = new SecretKeySpec(Base64.getDecoder().decode(accessSecret), "HmacSHA256");
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(accessSecretkey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractEmail(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(accessSecretkey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();

    }

    public long extractUserId(String token){
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(accessSecretkey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("userId", long.class);
    }
}
