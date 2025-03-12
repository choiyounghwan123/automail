package com.example.emailserviceauth_service.user.client;

import com.example.emailserviceauth_service.user.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service", url = "http://user-service:8080")
public interface UserClient {
    @GetMapping("/api/users")
    UserResponse getUserByEmail(@RequestParam String email);
}
