# 빌드 단계
FROM gradle:7.6-jdk17 AS builder
WORKDIR /app

# Gradle 메모리 설정
ARG GRADLE_OPTS
ENV GRADLE_OPTS=${GRADLE_OPTS:-"-Dorg.gradle.jvmargs=-Xmx1024m -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError"}

# Gradle 캐시를 위한 레이어 분리
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon --max-workers=2 --parallel --info

# 소스 코드 복사 및 빌드
COPY src ./src
RUN gradle build -x test --no-daemon --max-workers=2 --parallel --info

# 실행 단계
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

# JVM 메모리 설정
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:MaxMetaspaceSize=512m"

EXPOSE 8083
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]