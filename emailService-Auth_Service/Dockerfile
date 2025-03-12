FROM gradle:7.6-jdk AS builder
WORKDIR /app
COPY . .
RUN ./gradlew build --no-daemon -x test

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/emailService-Auth_Service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081

# Spring 프로필 및 실행 명령
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", "-jar", "/app/app.jar"]