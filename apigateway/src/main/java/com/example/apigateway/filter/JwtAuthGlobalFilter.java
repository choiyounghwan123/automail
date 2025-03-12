package com.example.apigateway.filter;

import com.example.apigateway.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class JwtAuthGlobalFilter implements GlobalFilter, Ordered {

    private final JwtUtil jwtUtil;

    public JwtAuthGlobalFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().toString();
        log.trace("Processing request: {} {}", request.getMethod(), path);

        // OPTIONS 요청 처리
        if (request.getMethod() == HttpMethod.OPTIONS) {
            log.trace("Handling OPTIONS request for {}", path);
            return chain.filter(exchange);
        }

        // 인증 제외 경로
        if (path.equals("/api/auth/login") || path.equals("/api/users/signup")) {
            log.trace("Bypassing auth for {}", path);
            return chain.filter(exchange);
        }

        String header = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        log.info("Authorization header: {}", header);
        if (header == null || !header.startsWith("Bearer ")) {
            log.warn("Missing or invalid Authorization header for {}", path);
            return unauthorizedResponse(exchange);
        }

        String token = header.substring(7);
        if (!jwtUtil.validateToken(token)) {
            log.warn("Invalid JWT token for {}", path);
            return unauthorizedResponse(exchange);
        }

        String email = jwtUtil.extractEmail(token);
        String role = jwtUtil.extractRole(token);
        log.info("Extracted email: {}, role: {}", email, role);
        ServerHttpRequest modifiedRequest = request.mutate()
                .header("X-User-Email", email)
                .header("X-User-Role", role)
                .build();

        log.trace("Forwarding request with added headers: X-User-Email={}, X-User-Role={}", email, role);
        return chain.filter(exchange.mutate().request(modifiedRequest).build());
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE; // 가장 높은 우선순위
    }

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}