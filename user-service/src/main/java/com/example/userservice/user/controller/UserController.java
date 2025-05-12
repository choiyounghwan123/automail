package com.example.userservice.user.controller;

import com.example.userservice.exception.UnauthorizedException;
import com.example.userservice.user.dto.ApiResponse;
import com.example.userservice.user.dto.ChangePasswordRequest;
import com.example.userservice.user.dto.EmailDto;
import com.example.userservice.user.dto.UserResponse;
import com.example.userservice.user.entity.User;
import com.example.userservice.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String >> changePassword(@RequestBody ChangePasswordRequest request, HttpServletRequest httpRequest){
        String email = httpRequest.getHeader("X-User-Email");

        if(email == null || email.isEmpty()){
            throw new UnauthorizedException("유효한 인증정보가 없습니다.");
        }

        userService.changePassword(email, request.getCurrentPassword(), request.getNewPassword());
        ApiResponse<String> response = new ApiResponse<>(true,"비밀번호 변경 성공",null);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<UserResponse> getUserByEmail(@RequestParam String email){
        log.info("Original email: {}", email);
        String decodedEmail = URLDecoder.decode(email, StandardCharsets.UTF_8);
        log.info("Decoded email: {}", decodedEmail);
        UserResponse user = userService.findbyEmail(decodedEmail);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/email")
    public ResponseEntity<ApiResponse<EmailDto>> getEmail(){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails){
            UserDetails userDetails = (UserDetails) principal;
            String email = userDetails.getUsername();

            EmailDto emailDto = new EmailDto(email);
            ApiResponse<EmailDto> response = new ApiResponse<>(true, emailDto, null);
            return ResponseEntity.ok(response);
        }else{
            return ResponseEntity.status(401).body(new ApiResponse<>(false,null,"401"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(HttpServletRequest request) {
        String email = request.getHeader("X-User-Email");
        if (email == null || email.isEmpty()) {
            throw new UnauthorizedException("유효한 인증정보가 없습니다.");
        }
        UserResponse user = userService.findbyEmail(email);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/verify/resend")
    public ResponseEntity<ApiResponse<String>> resendVerificationEmail(@RequestBody EmailDto emailDto) {
        userService.resendVerificationEmail(emailDto.getEmail());
        return ResponseEntity.ok(new ApiResponse<>(true, "인증 이메일이 재전송되었습니다.", null));
    }
}
