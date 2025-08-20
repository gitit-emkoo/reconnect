import React, { useState } from 'react';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import NavigationBar from '../components/NavigationBar';
import AgreementList from '../components/agreement/AgreementList';
import ConfirmationModal from '../components/common/ConfirmationModal';
import styled from 'styled-components';
import { Container as BaseContainer } from '../styles/CommonStyles';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import ImgAgreement from '../assets/Img_Agreement.png';

const Container = styled(BaseContainer)`
  max-width: 480px;
  margin: 0 auto;
  padding: 0;
  background-color: #ffffff;
`;
const TopButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1.5rem 1.2rem 0.5rem 1.2rem;
`;
const TopButton = styled.button<{ $primary?: boolean }>`
  flex: 1;
  background: ${p => p.$primary ? '#785cd2' : '#28a745'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1.08rem;
  cursor: pointer;
`;

const GradientButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin: 1.2rem 1.2rem 0 1.2rem;
  padding: 1.2rem 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.2rem;
  color: white;
  background: linear-gradient(90deg, #785CD2 0%, #FF69B4 100%);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(120,92,210,0.15);
  transition: all 0.2s ease;
  min-height: 60px;
  width: calc(100% - 2.4rem);
  
  &:hover {
    filter: brightness(1.05);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(120,92,210,0.2);
  }
  
  img {
    width: 50px;
    height: 50px;
    
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
          <TopButton $primary onClick={handleAgreementCreateClick}>✒️ 합의서 작성</TopButton>
          <TopButton onClick={() => window.location.href = '/agreement-verification'}>🔐 합의서 인증</TopButton>
        </TopButtonRow>
        <GradientButton onClick={() => navigate('/issued-agreements')}>
          <img src={ImgAgreement} alt="발행 합의서" />
          발행 합의서 보관함
        </GradientButton>
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

