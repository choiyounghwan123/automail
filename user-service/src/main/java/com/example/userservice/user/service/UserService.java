package com.example.userservice.user.service;

import com.example.userservice.exception.BadRequestException;
import com.example.userservice.user.dto.SignupRequestDto;
import com.example.userservice.user.dto.UserResponse;
import com.example.userservice.user.entity.Role;
import com.example.userservice.user.entity.User;
import com.example.userservice.user.rabbitMQ.RabbitMQProducer;
import com.example.userservice.user.rabbitMQ.dto.MessageEmailDto;
import com.example.userservice.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RabbitMQProducer rabbitMQProducer;

    public void signup(SignupRequestDto requestDto){
        if (userRepository.findByEmail(requestDto.getEmail()).isPresent()){
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());

        User user = new User().builder()
                .email(requestDto.getEmail())
                .password(encodedPassword)
                .isActive(false)
                .role(Role.USER)

                .build();

        userRepository.save(user);
        MessageEmailDto messageEmailDto = MessageEmailDto.builder()
                        .email(requestDto.getEmail())
                                .build();
        rabbitMQProducer.sendEmailVerificationMessage(messageEmailDto);
    }

    public UserResponse findbyEmail(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println(user.getPassword());
        return new UserResponse(user.getEmail(),user.getPassword(),user.getRole());
    }

    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())){
            throw new BadRequestException("현재 비밀번호가 일치하지 않습니다.");
        }

        if(currentPassword.equals(newPassword)){
            throw new BadRequestException("새로운 비밀번호는 현재 비밀번호와 달라야 합니다.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
