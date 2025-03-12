package com.example.subscription.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse <T>{
    private boolean success;
    private T data;
    private String error;
}
