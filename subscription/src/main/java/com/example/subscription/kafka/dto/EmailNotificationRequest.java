package com.example.subscription.kafka.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class EmailNotificationRequest {
    private String title;
    private String content;
    private String link;
    private List<String> recipients;
    private List<String> images;

    public EmailNotificationRequest(Notice notice, List<String> recipients){
        this.title = notice.getTitle();
        this.content = notice.getContent();
        this.link = notice.getLink();
        this.recipients = recipients;
        this.images = notice.getImages();
    }
}
