package com.example.subscription.kafka.dto;

import lombok.Data;

@Data
public class Notice {
    private String title;
    private String link;
    private String content;
    private String crawledAt;
}
