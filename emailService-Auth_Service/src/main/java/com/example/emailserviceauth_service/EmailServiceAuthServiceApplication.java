package com.example.emailserviceauth_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
public class EmailServiceAuthServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmailServiceAuthServiceApplication.class, args);
    }

}
