package com.example.emailserviceauth_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class EmailServiceAuthServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmailServiceAuthServiceApplication.class, args);
    }

}
