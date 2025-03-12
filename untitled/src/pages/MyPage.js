import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0eafc, #cfdef3);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  padding: 2rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 550px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 3rem;
  text-align: center;
  border: 1px solid rgba(229, 231, 235, 0.5);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e3a8a;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 2.5rem;
  font-weight: 400;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  text-align: left;
`;

const Info = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Label = styled.div`
  font-size: 0.95rem;
  color: #475569;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 1.2rem;
  color: #1f2937;
  font-weight: 500;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 20px;
  background-color: ${(props) => (props.verified ? '#34d399' : '#f87171')};
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Button = styled.button`
  margin-top: 2rem;
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:hover {
    background: linear-gradient(90deg, #2563eb, #3b82f6);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #9ca3af;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const LoadingWrapper = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

function MyPage() {
    const [email, setEmail] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:8080/api/mypage', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('서버 응답 데이터:', response.data);
                const { email, isActive, subscribed } = response.data.data;

                // 상태 업데이트
                setEmail(email);
                setEmailVerified(isActive);
                setSubscribed(subscribed);
                console.log('emailVerified 업데이트:', isActive);
                console.log('subscribed 업데이트:', subscribed);
            } catch (error) {
                console.error('사용자 데이터를 불러오는 중 오류 발생:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSendVerification = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(
                'http://localhost:8080/api/user/verify-email',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('인증 메일이 발송되었습니다.');
        } catch (error) {
            console.error('인증 메일 발송 실패:', error);
            alert('인증 메일 발송에 실패했습니다. 다시 시도해주세요.');
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
                <Subtitle>당신의 정보를 한눈에 확인하세요</Subtitle>

                <InfoGrid>
                    <Info>
                        <Label>이메일</Label>
                        <Value>{email}</Value>
                    </Info>

                    <Info>
                        <Label>이메일 인증 상태</Label>
                        <Badge verified={emailVerified}>
                            {emailVerified ? '인증됨' : '미인증'}
                        </Badge>
                    </Info>

                    <Info>
                        <Label>구독 상태</Label>
                        <Badge verified={subscribed}>
                            {subscribed ? '구독 중' : '비구독'}
                        </Badge>
                    </Info>
                </InfoGrid>

                {!emailVerified && (
                    <Button onClick={handleSendVerification}>인증 메일 다시 보내기</Button>
                )}
            </Card>
        </PageWrapper>
    );
}

export default MyPage;