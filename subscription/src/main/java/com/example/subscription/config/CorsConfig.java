package com.example.subscription.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 허용할 출처(Origin) 설정
        config.addAllowedOrigin("http://localhost:3000"); // React 개발 서버
        config.addAllowedOrigin("http://localhost:8080"); // API Gateway
        
        // 허용할 HTTP 메서드 설정
        config.addAllowedMethod("*");
        
        // 허용할 헤더 설정
        config.addAllowedHeader("*");
        
        // 인증 정보(쿠키, 인증 헤더 등) 허용
        config.setAllowCredentials(true);
        
        // 모든 경로에 대해 CORS 설정 적용
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
} 