# 빌드 단계
FROM gradle:7.6-jdk17 AS builder
WORKDIR /app
# 의존성 캐싱을 위해 먼저 복사
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle
RUN chmod +x ./gradlew
# 의존성 다운로드
RUN ./gradlew dependencies --no-daemon
# 소스 코드 복사 후 빌드
COPY src ./src
RUN ./gradlew build --no-daemon -x test

# 실행 단계
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/subscription-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081

# Spring 프로필 및 실행 명령
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", "-jar", "/app/app.jar"]