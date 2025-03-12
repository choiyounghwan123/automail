package com.example.userservice.exception;

public class UnauthorizedException extends RuntimeException{
    public UnauthorizedException(String mesaage){
        super(mesaage);
    }
}
