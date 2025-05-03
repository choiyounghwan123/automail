package com.example.subscription.subscription.service;

import com.example.subscription.subscription.dto.SubscriptionRequest;
import com.example.subscription.subscription.entity.Subscription;
import com.example.subscription.subscription.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import com.example.subscription.subscription.entity.Subscription.Frequency;
import java.nio.file.attribute.UserPrincipal;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;

    public void savedSubscription(User principal, SubscriptionRequest subscriptionRequest){
        if(subscriptionRepository.existsByEmail(principal.getUsername())){
            throw new RuntimeException("이미 등록되어있습니다.");
        }
        Subscription subscription = new Subscription().builder()
                .frequency(Frequency.IMMEDIATE)
                .email(principal.getUsername())
                .build();

        subscriptionRepository.save(subscription);
    }

    public boolean isSubscribed(User principal){
        return subscriptionRepository.existsByEmail(principal.getUsername());
    }
}
