package com.example.emailserviceauth_service.common.exception;

import com.example.emailserviceauth_service.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GlobalExceptionHandler {
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException ex){
        ErrorCode errorCode = ex.getErrorCode();

        ApiResponse<Void> response = new ApiResponse<>(
                false,
                null,
                errorCode.getMessage()
        );
        return new ResponseEntity<>(response, errorCode.getStatus());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception ex){
        ApiResponse<Void> response = new ApiResponse<>(
                false,
                null,
                "알 수 없는 오류가 발생했습니다."
        );
        return new ResponseEntity<>(response, ErrorCode.INTERNAL_SERVER_ERROR.getStatus());
    }
}
