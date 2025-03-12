package com.example.apigateway.filter;

import com.example.apigateway.util.JwtUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class JwtAuthGatewayFilterFactory extends AbstractGatewayFilterFactory<JwtAuthGatewayFilterFactory.Config> {

    private final JwtUtil jwtUtil;

    public JwtAuthGatewayFilterFactory(JwtUtil jwtUtil) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getPath().toString();
            log.trace("Processing request: {} {}", request.getMethod(), path);

            // OPTIONS 요청 처리
            if (request.getMethod() == HttpMethod.OPTIONS) {
                log.trace("Handling OPTIONS request for {}", path);
                ServerHttpResponse response = exchange.getResponse();
                response.getHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
                response.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                response.getHeaders().add("Access-Control-Allow-Headers", "Authorization, Content-Type, X-User-Email, X-User-Role");
                response.getHeaders().add("Access-Control-Allow-Credentials", "true");
                response.getHeaders().add("Access-Control-Max-Age", "3600");
                return chain.filter(exchange);  // 체인 계속 진행
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
            log.info("User email: {}, role: {}", email, role);
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Email", email)
                    .header("X-User-Role", role)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        };
    }

    @Getter
    @Setter
    public static class Config {
        private boolean required = true;
    }

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}