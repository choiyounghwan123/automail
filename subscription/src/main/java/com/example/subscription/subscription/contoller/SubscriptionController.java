package com.example.subscription.subscription.contoller;

import com.example.subscription.common.dto.ApiResponse;
import com.example.subscription.subscription.dto.SubscriptionRequest;
import com.example.subscription.subscription.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.nio.file.attribute.UserPrincipal;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<ApiResponse<String >> createSubscription(
            @Valid @RequestBody SubscriptionRequest subscriptionRequest, Authentication authentication){

        User user = (User) authentication.getPrincipal();
        subscriptionService.savedSubscription(user,subscriptionRequest);

        ApiResponse<String> response = new ApiResponse<>(true,"구독 완료!",null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<Boolean> getSubscriptionStatus(Authentication authentication){
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(subscriptionService.isSubscribed(user));
    }
}
