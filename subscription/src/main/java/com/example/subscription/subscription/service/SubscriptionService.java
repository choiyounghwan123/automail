package com.example.subscription.subscription.service;

import com.example.subscription.subscription.dto.SubscriptionRequest;
import com.example.subscription.subscription.entity.Subscription;
import com.example.subscription.subscription.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import com.example.subscription.subscription.entity.Subscription.Frequency;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;

    public void savedSubscription(User principal, SubscriptionRequest subscriptionRequest){
        if(subscriptionRepository.existsByEmail(principal.getUsername())){
            throw new RuntimeException("이미 등록되어있습니다.");
        }
        Subscription subscription = new Subscription().builder()
                .email(principal.getUsername())
                .frequency(Frequency.IMMEDIATE)
                .build();

        subscriptionRepository.save(subscription);
    }

    public boolean isSubscribed(User principal){
        return subscriptionRepository.existsByEmail(principal.getUsername());
    }

    public Subscription getSubscriptionDetails(User principal) {
        return subscriptionRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("구독 정보를 찾을 수 없습니다."));
    }
}
