package com.example.apigateway.controller;

import com.example.apigateway.dto.common.ApiResponse;
import com.example.apigateway.dto.mypage.MypageResponseDto;
import com.example.apigateway.dto.mypage.UserInfoDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Slf4j
public class GatewayController {

    private final WebClient webClient;

    public GatewayController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
    @GetMapping("/mypage")
    public Mono<ResponseEntity<ApiResponse<MypageResponseDto>>> getMypage(ServerWebExchange exchange) {
        String email = exchange.getRequest().getHeaders().getFirst("X-User-Email");
        String role = exchange.getRequest().getHeaders().getFirst("X-User-Role");
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        // 필터가 헤더를 보장하므로 null 체크 최소화 (디버깅용으로 남겨둘 수 있음)
        if (email == null || role == null) {
            return Mono.just(ResponseEntity.status(401)
                    .body(new ApiResponse<>(false, null, "User info missing after filter")));
        }
        log.info("Processing mypage request for email: {}", email); // 로깅 추가

        Mono<UserInfoDto> userInfo = webClient.get()
                .uri("http://user-service:8080/api/users/mypage")
                .header(HttpHeaders.AUTHORIZATION, authHeader)
                .header("X-User-Email", email)
                .header("X-User-Role", role)
                .retrieve()
                .bodyToMono(UserInfoDto.class)
                .doOnNext(dto -> log.info("UserInfo received: {}", dto)) // 응답 로깅
                .onErrorResume(e -> {
                    log.error("UserService call failed: {}", e.getMessage());
                    return Mono.just(new UserInfoDto());
                });
        log.info("userInfo: {}", userInfo);
        Mono<Boolean> subscriptionMono = webClient.get()
                .uri("http://subscription:9090/api/subscriptions/status")
                .header("X-User-Email", email)
                .header("X-User-Role", role)
                .retrieve()
                .bodyToMono(Boolean.class)
                .onErrorResume(e -> {
                    System.out.println("Subscription service call failed: " + e.getMessage());
                    return Mono.just(false);
                });

        return Mono.zip(userInfo, subscriptionMono)
                .map(tuple -> {
                    UserInfoDto userInfoDto = tuple.getT1();
                    boolean status = tuple.getT2();
                    MypageResponseDto mypageResponseDto = new MypageResponseDto();
                    mypageResponseDto.setEmail(userInfoDto.getEmail());
                    mypageResponseDto.setSubscribed(status);
                    mypageResponseDto.setCreatedAt(userInfoDto.getJoinDate());
                    mypageResponseDto.setIsActive(userInfoDto.getIsActive());
                    ApiResponse<MypageResponseDto> response = new ApiResponse<>(true, mypageResponseDto, null);
                    return ResponseEntity.ok(response);
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.status(500)
                        .body(new ApiResponse<>(false, null, "Error retrieving mypage info"))));
    }
}