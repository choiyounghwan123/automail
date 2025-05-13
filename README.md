# 📧 AutoMail Service

> **공지 자동 크롤링 & 이미지 포함 이메일 발송 시스템**

---

## 📝 프로젝트 소개

학교/기관의 공지사항을 자동으로 크롤링하여, 이미지와 함께 구독자에게 이메일로 발송하는 마이크로서비스 기반 자동화 플랫폼입니다. 

- **이미지 포함 공지 메일**을 자동으로 발송
- **구독 관리** 및 다양한 알림 채널 확장 가능
- Docker Compose 기반의 손쉬운 배포 및 확장

---

## 🚀 주요 기능

| 기능                | 설명                                                         |
|---------------------|--------------------------------------------------------------|
| 공지 크롤링         | FastAPI 기반 크롤러가 주기적으로 공지 및 이미지를 수집        |
| 이미지 자동 첨부    | 이미지를 base64로 인코딩하여 이메일 본문에 바로 표시          |
| 실시간 알림         | Kafka를 통한 비동기 메시징, Celery로 대용량 이메일 처리        |
| 구독 관리           | Spring Boot 기반 구독/사용자 서비스와 연동                   |
| 완전 자동화         | Docker Compose로 전체 서비스 오케스트레이션                  |

---

## 🛠️ 사용 기술 (Tech Stack)

- **Backend**: Python (FastAPI, Django), Java (Spring Boot)
- **Messaging**: Kafka, RabbitMQ
- **Task Queue**: Celery, Redis
- **Database**: MySQL, PostgreSQL
- **Infra**: Docker, Docker Compose
- **Frontend**: React (관리자/구독자 페이지, 선택적)

---

## 🏗️ 아키텍처

```mermaid
graph TD;
    A[크롤러 (FastAPI)] -- Kafka --> B[이메일 서비스 (Django)]
    B -- Celery --> C[이메일 발송]
    B -- DB --> D[(MySQL)]
    B -- Redis --> E[(Redis)]
    B -- RabbitMQ --> F[(RabbitMQ)]
    B -- Kafka --> G[(Kafka)]
    H[구독/사용자 서비스 (Spring Boot)] -- DB --> I[(PostgreSQL)]
    H -- Kafka --> G
    subgraph Infra
      D
      E
      F
      G
      I
    end
```

---

## ⚡ 빠른 시작 (Quick Start)

1. **환경 변수(.env) 설정**
   - 예시: `FastAPIProject1/config.py` 참고

2. **전체 서비스 빌드 및 실행**
   ```bash
   docker compose up -d --build
   ```

3. **주요 서비스만 리빌드/재시작 (코드 수정 시)**
   ```bash
   docker compose up -d --build email-service kafka-consumer celery
   ```

4. **로그 확인**
   ```bash
   docker compose logs -f email-service
   docker compose logs -f celery
   ```

---

## 📂 프로젝트 구조

```
.
├── FastAPIProject1/      # 크롤러 서비스 (Python, FastAPI)
├── email-service/        # Django 기반 이메일 서비스
├── subscription/         # 구독 관리 서비스 (Spring Boot)
├── user-service/         # 사용자 서비스 (Spring Boot)
├── apigateway/           # API Gateway
├── docker-compose.yml    # 전체 서비스 오케스트레이션
└── ...
```

---

## 💡 주요 코드/기술 포인트

- **이미지 base64 인코딩**: 크롤러가 이미지를 base64로 변환해 Kafka로 전송 → 이메일 본문에 바로 표시
- **비동기 대용량 처리**: Celery + RabbitMQ + Redis로 대량 이메일도 안정적으로 발송
- **마이크로서비스 구조**: 각 서비스 독립 개발/배포, 확장성 우수
- **Docker Compose**: 개발/운영 환경 모두 손쉽게 관리

---

## 🙌 기여 및 문의

- 이 프로젝트는 취업 포트폴리오 및 실전 서비스 개발을 위해 설계되었습니다.
- 궁금한 점, 개선 제안, 버그 제보는 [GitHub Issues](https://github.com/choiyounghwan123/automail/issues)로 남겨주세요.

---

## 📝 License

MIT 