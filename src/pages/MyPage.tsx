// src/pages/MyPage.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import axios from 'axios';

const Container = styled.div`
  background-color: #FFF8F3; /* 웰컴 이미지와 어울리는 밝은 베이지 */
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #FF69B4; /* 핑크 계열 */
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Section = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #4169E1; /* 로얄 블루 */
  margin-bottom: 1rem;
`;

const InfoItem = styled.p`
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
  strong {
    font-weight: 600;
    color: #666;
  }
`;

const Button = styled.button`
  background: linear-gradient(to right, #FF69B4, #4169E1);
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: opacity 0.2s ease-in-out;
  
  &:hover {
    opacity: 0.9;
  }
`;

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    nickname: localStorage.getItem('userNickname') || '사용자',
    email: localStorage.getItem('userEmail') || '-',
    partnerName: '-',
    subscriptionStatus: '일반 회원'
  });

  useEffect(() => {
    // 로그인 체크
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserInfo(prevInfo => ({
          ...prevInfo,
          nickname: response.data.nickname || prevInfo.nickname,
          email: response.data.email || prevInfo.email,
          partnerName: response.data.partner?.nickname || '-',
          subscriptionStatus: response.data.subscriptionStatus || '일반 회원'
        }));
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleLogout = async () => {
    const success = await logout(navigate);
    if (!success) {
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handlePasswordChange = () => {
    navigate('/profile/password');
  };

  return (
    <Container>
      <Title>마이 페이지 👤</Title>
      <Section>
        <SectionTitle>내 정보</SectionTitle>
        <InfoItem>
          <strong>닉네임:</strong> {userInfo.nickname}
        </InfoItem>
        <InfoItem>
          <strong>이메일:</strong> {userInfo.email}
        </InfoItem>
        <InfoItem>
          <strong>연결된 파트너:</strong> {userInfo.partnerName}
        </InfoItem>
        <InfoItem>
          <strong>구독 상태:</strong> {userInfo.subscriptionStatus}
        </InfoItem>
        <Button onClick={handleEditProfile}>정보 수정</Button>
      </Section>

      <Section>
        <SectionTitle>설정</SectionTitle>
        <Button style={{ marginRight: '1rem' }}>알림 설정</Button>
        <Button onClick={handlePasswordChange}>비밀번호 변경</Button>
      </Section>

      <Section>
        <SectionTitle>기타</SectionTitle>
        <Button style={{ marginRight: '1rem' }}>자주 묻는 질문</Button>
        <Button onClick={handleLogout}>로그아웃</Button>
      </Section>
    </Container>
  );
};

export default MyPage;