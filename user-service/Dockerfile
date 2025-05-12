FROM gradle:7.6-jdk17 AS builder
WORKDIR /app

# Gradle 캐시를 위한 레이어 분리
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon

# 소스 코드 복사 및 빌드
COPY src ./src
RUN gradle build -x test --daemon --parallel --max-workers=2

FROM amazoncorretto:17-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-Xmx512m", "-jar", "app.jar"]

# Spring 프로필 및 실행 명령
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", "-jar", "/app/app.jar"]

# FROM openjdk:17-jdk-slim
# WORKDIR /app
# COPY user-service-0.0.1-SNAPSHOT.jar app.jar
# EXPOSE 8081
# ENTRYPOINT ["java", "-jar", "app.jar"]