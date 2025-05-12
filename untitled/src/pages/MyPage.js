import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  padding: 2rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  animation: ${fadeIn} 0.5s ease-in;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #fafafa;
  border-radius: 12px;
  transition: background 0.2s ease;
  &:hover {
    background: #f1f5f9;
  }
`;

const Label = styled.div`
  font-size: 0.95rem;
  color: #4b5563;
  font-weight: 500;
`;

const Value = styled.div`
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
`;

const Badge = styled.span`
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 20px;
  background: ${(props) => (props.verified ? "#dcfce7" : "#fee2e2")};
  color: ${(props) => (props.verified ? "#16a34a" : "#dc2626")};
`;

const Button = styled.button`
  margin-top: 2rem;
  width: 100%;
  padding: 0.9rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: #374151;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #1f2937;
  }
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  color: #6b7280;
`;

const Spinner = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #d1d5db;
  border-top: 2px solid #374151;
  border-radius: 50%;
  animation: ${keyframes`to { transform: rotate(360deg); }`} 1s linear infinite;
`;

function MyPage() {
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${BASE_URL}/api/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const { email, isActive, subscribed } = response.data;
        setEmail(email);
        setEmailVerified(isActive);
        setSubscribed(subscribed);
      } catch (error) {
        console.error("사용자 데이터를 불러오는 중 오류 발생:", error);
        if (error.response && error.response.status === 401) {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSendVerification = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://10.125.208.184:8080/api/user/verify-email",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("인증 메일이 발송되었습니다.");
    } catch (error) {
      console.error("인증 메일 발송 실패:", error);
      alert("인증 메일 발송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <Card>
          <LoadingWrapper>
            <Spinner />
            로딩 중...
          </LoadingWrapper>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Card>
        <Title>마이페이지</Title>
        <Subtitle>당신의 정보를 확인하세요</Subtitle>

        <InfoGrid>
          <Info>
            <Label>이메일</Label>
            <Value>{email}</Value>
          </Info>
          <Info>
            <Label>이메일 인증</Label>
            <Badge verified={emailVerified}>
              {emailVerified ? "인증됨" : "미인증"}
            </Badge>
          </Info>
          <Info>
            <Label>구독 상태</Label>
            <Badge verified={subscribed}>
              {subscribed ? "구독 중" : "비구독"}
            </Badge>
          </Info>
        </InfoGrid>

        {!emailVerified && (
          <Button onClick={handleSendVerification}>인증 메일 보내기</Button>
        )}
      </Card>
    </PageWrapper>
  );
}

export default MyPage;
