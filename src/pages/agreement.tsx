import React, { useState } from 'react';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import NavigationBar from '../components/NavigationBar';
import AgreementList from '../components/agreement/AgreementList';
import ConfirmationModal from '../components/common/ConfirmationModal';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 0 0 80px;
  background-color: #ffffff;
`;

const TopButtonRow = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 2rem auto 1rem;
`;

const TextButton = styled.button<{ $primary?: boolean }>`
  background: none;
  border: none;
  color: ${p => p.$primary ? '#785cd2' : '#28a745'};
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.2s ease;

  &:hover {
    color: ${p => p.$primary ? '#6a4fc7' : '#218838'};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: currentColor;
    transition: width 0.2s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const GradientTextButton = styled.button`
  display: block;
  margin: 1.5rem auto 0 auto;
  background: none;
  border: none;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  position: relative;
  background: linear-gradient(90deg, #785CD2 0%, #FF69B4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #785CD2 0%, #FF69B4 100%);
    transition: width 0.2s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const AgreementPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [showPartnerRequiredModal, setShowPartnerRequiredModal] = useState(false);

  const handleAgreementCreateClick = () => {
    // 파트너 연결 여부 확인
    if (!user?.partner?.id) {
      setShowPartnerRequiredModal(true);
      return;
    }
    
    // 파트너가 있으면 합의서 작성 페이지로 이동
    navigate('/agreement/create');
  };

  return (
    <>
    <Header title="리커넥트 인증 합의서" />
    <BackButton />
      <Container>
        <TopButtonRow>
          <TextButton $primary onClick={handleAgreementCreateClick}>✒️ 합의서 작성</TextButton>
          <TextButton onClick={() => window.location.href = '/agreement-verification'}>🔐 합의서 인증</TextButton>
        </TopButtonRow>
        <GradientTextButton onClick={() => navigate('/issued-agreements')}>📄 발행 합의서 보관함</GradientTextButton>
        <AgreementList />
      </Container>
      <NavigationBar />
      
      {/* 파트너 연결 필요 모달 */}
      <ConfirmationModal
        isOpen={showPartnerRequiredModal}
        onRequestClose={() => setShowPartnerRequiredModal(false)}
        onConfirm={() => setShowPartnerRequiredModal(false)}
        title="파트너 연결 필요"
        message="합의서 작성은 파트너와 연결되어 있는 사용자만 이용할 수 있습니다.파트너와 연결 후 재시도 바랍니다."
        confirmButtonText="확인"
        showCancelButton={false}
      />
    </>
  );
};

export default AgreementPage;

