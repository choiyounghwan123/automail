package com.example.userservice.user.rabbitMQ.dto;

import lombok.*;

@Getter
@ToString
public class MessageEmailDto {
    private String email;

    @Builder
    public MessageEmailDto(String email){
        this.email = email;
    }
}
