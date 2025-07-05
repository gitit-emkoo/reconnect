import React from 'react';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import NavigationBar from '../components/NavigationBar';
import AgreementList from '../components/agreement/AgreementList';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 0 0 80px;
`;
const TopButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1.5rem auto 0.5rem;
`;
const TopButton = styled.button<{ $primary?: boolean }>`
  background: ${p => p.$primary ? '#785cd2' : '#28a745'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1.08rem;
  cursor: pointer;
`;

const AgreementPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header title="리커넥트 인증 합의서" />
      <BackButton />
      <Container>
        <TopButtonRow>
          <TopButton $primary onClick={() => navigate('/agreement/create')}>✒️ 합의서 작성</TopButton>
          <TopButton onClick={() => window.location.href = '/agreement-verification'}>🔐 합의서 인증</TopButton>
        </TopButtonRow>
        <AgreementList />
      </Container>
      <NavigationBar />
    </>
  );
};

export default AgreementPage;

