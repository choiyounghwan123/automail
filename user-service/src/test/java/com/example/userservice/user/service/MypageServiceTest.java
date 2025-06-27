// package com.example.userservice.user.service;

// import com.example.userservice.user.dto.UserInfoDto;
// import com.example.userservice.user.entity.User;
// import com.example.userservice.user.repository.UserRepository;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContext;
// import org.springframework.security.core.context.SecurityContextHolder;

// import java.time.LocalDateTime;
// import java.util.Optional;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.Mockito.*;

// @ExtendWith(MockitoExtension.class)
// public class MypageServiceTest {

//     @InjectMocks
//     private MypageService mypageService;

//     @Mock
//     private UserRepository userRepository;

//     @Mock
//     private SecurityContext securityContext;

//     @Mock
//     private Authentication authentication;

//     @BeforeEach
//     void setUp(){
//         SecurityContextHolder.setContext(securityContext);
//         when(securityContext.getAuthentication()).thenReturn(authentication);
//     }

//     @Test
//     void getUserInfo_success() {
//         // Given
//         String email = "test@example.com";
//         User user = new User();
//         user.setEmail(email);
//         user.setCreateAt(LocalDateTime.of(2025, 2, 21, 10, 0));

//         when(authentication.getName()).thenReturn(email);
//         when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

//         // When
//         UserInfoDto result = mypageService.getUserInfo();

//         // Then
//         assertNotNull(result);
//         assertEquals(email, result.getEmail());
//         assertEquals(LocalDateTime.of(2025, 2, 21, 10, 0), result.getJoinDate());
//         verify(userRepository, times(1)).findByEmail(email);
//     }

//     @Test
//     void getUserInfo_userNotFound_throwsException() {
//         // Given
//         String email = "unknown@example.com";

//         when(authentication.getName()).thenReturn(email);
//         when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

//         // When & Then
//         IllegalArgumentException exception = assertThrows(
//                 IllegalArgumentException.class,
//                 () -> mypageService.getUserInfo()
//         );
//         assertEquals("User not found", exception.getMessage());
//         verify(userRepository, times(1)).findByEmail(email);
//     }
// }
