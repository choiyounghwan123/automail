# 📧 AutoMail Service

> **공지 자동 크롤링 & 이미지 포함 이메일 발송 시스템**

---

## 📝 프로젝트 소개

AutoMail Service는 부산대학교 의생명융합공학부의 공지사항을 자동으로 수집하고, 이미지와 함께 구독자에게 이메일로 발송하는 마이크로서비스 기반 자동화 시스템입니다.
- 의생명융합공학부 홈페이지의 공지사항을 주기적으로 크롤링
- 이미지가 포함된 이메일로 구독자에게 자동 발송
- Docker Compose 기반으로 간편한 배포 및 유지보수 가능

---

## 🚀 주요 기능

| 기능                | 설명                                                         |
|---------------------|--------------------------------------------------------------|
| 공지 크롤링         | 크롤러가 주기적으로 공지 및 이미지를 수집        |
| 이미지 자동 첨부    | 이미지를 base64로 인코딩하여 이메일 본문에 바로 표시          |
| 실시간 알림         | Kafka를 통한 비동기 메시징, Celery로 대용량 이메일 처리        |
| 구독 관리           | Spring Boot 기반 구독/사용자 서비스와 연동                   |
| 완전 자동화         | Docker Compose로 전체 서비스 오케스트레이션                  |

---

## 🛠️ 사용 기술 (Tech Stack)

- **Backend**: Python (FastAPI, Django), Java (Spring Boot)
- **Messaging**: Kafka, RabbitMQ
- **Task Queue**: Celery
- **Database**: MySQL, PostgreSQL, redis
- **Infra**: Docker, Docker Compose
- **Frontend**: React (구독자 페이지, 선택적)

---

## 🏗️ 아키텍처



---




## 🙌 기여 및 문의

- 궁금한 점, 개선 제안, 버그 제보는 [GitHub Issues](https://github.com/choiyounghwan123/automail/issues)로 남겨주세요.

---

## 📝 License

MIT 
