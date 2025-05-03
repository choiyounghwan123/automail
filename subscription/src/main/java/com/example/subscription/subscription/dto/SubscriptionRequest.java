package com.example.subscription.subscription.dto;

import com.example.subscription.subscription.entity.Subscription;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionRequest {
    // @NotNull(message = "frequency가 비어져있습니다.")
    private Subscription.Frequency frequency;
}
