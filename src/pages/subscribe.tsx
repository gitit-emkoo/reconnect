import React, { useState } from 'react';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import styled from 'styled-components';
import NavigationBar from '../components/NavigationBar';
import ConfirmationModal from '../components/common/ConfirmationModal';

const Container = styled.div`
  background-color: #f6f8fb;
  min-height: 100vh;
  padding: 2rem;
  padding-bottom: 70px; /* NavigationBar 높이만큼 패딩 */
  font-family: 'Pretendard', sans-serif;
  color: #222;
`;

const ContentContainer = styled.div`
  max-width: 740px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const Title = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.6rem;
`;

const Description = styled.div`
  font-size: 0.95rem;
  color: #444;
  line-height: 1.6;
  margin-bottom: 1.4rem;
  
  strong {
    font-weight: bold;
  }
`;

const Button = styled.button<{ variant: 'primary' | 'yellow' | 'blue' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8rem 1.6rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  text-align: center;
  border: none;
  margin: 0 auto;
  width: fit-content;
  
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(to right, #8367ff, #da86f7);
          color: white;
        `;
      case 'yellow':
        return `
          background: #fff1a8;
          color: #333;
        `;
      case 'blue':
        return `
          background: #d0e8ff;
          color: #333;
        `;
      default:
        return '';
    }
  }}
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SubscribePage: React.FC = () => {
  const [modalType, setModalType] = useState<'report' | 'agreement' | null>(null);

  const handleSubscribe = () => {
    // 구독 로직 구현
    console.log('구독하기 클릭');
  };

  const handleReportView = () => {
    setModalType('report');
  };

  const handleAgreementSave = () => {
    setModalType('agreement');
  };

  const handleModalConfirm = () => {
    if (modalType === 'report') {
      // 리포트 열람 로직 구현
      console.log('리포트 열람 클릭');
    } else if (modalType === 'agreement') {
      // 합의서 발행 로직 구현
      console.log('합의서 발행 클릭');
    }
    setModalType(null);
  };

  return (
    <>
      <Header title="구독(결제)" />
      <BackButton />
      <Container>
        <ContentContainer>
          {/* 리커넥트케어 구독 */}
          <Section>
            <Title>💙 리커넥트 케어</Title>
            <Description>
              감정트랙과 자기이해진단으로 나의 정서를<br/> 
              케어하고, 리커넥트 보증합의서를 통해 <br/>
              <strong>관계의 현실을 지켜주는</strong> 케어 구독입니다.<br/><br/>
              ✔ 월간 감정트랙 보고서<br/>
              ✔ 합의서 무제한 발행 및 출력<br/>
              ✔ 자기이해 진단 매월 1회<br/><br/>
              💳 <strong>월 3,900원 / 무료 이벤트 중</strong>
            </Description>
            <Button variant="primary" onClick={handleSubscribe}>
              무료 구독 시작
            </Button>
          </Section>

          {/* 감정트랙 리포트 단품 */}
          <Section>
            <Title>감정트랙 보고서 열람권</Title>
            <Description>
              감정일기를 AI가 분석하고<br/> 
              매월 <strong>한 장의 리듬으로 정리하는</strong><br/>
              정서적 데이터로 상담과 회고<br/>
              자기 돌봄에 활용 됩니다.<br/><br/>
              💵 <strong>₩1,000 / 1건 열람권</strong>
            </Description>
            <Button variant="blue" onClick={handleReportView}>
              트랙 리포트 열람
            </Button>
          </Section>

          {/* 보증합의서 PDF 단품 */}
          <Section>
            <Title>인증 합의서 발행권</Title>
            <Description>
              서로의 신뢰에 기반한 약속을<br/>
              관계의 정의를 위한 계약으로<br/>
              인증하는 현실적 대비를 위한<br/>
              증빙 문서입니다.<br/><br/>
              💵 <strong>₩1,000 / 1회 발행 및 저장</strong>
            </Description>
            <Button variant="yellow" onClick={handleAgreementSave}>
              인증 합의서 발행
            </Button>
          </Section>
        </ContentContainer>
      </Container>
      <NavigationBar />
      {/* 컨펌 모달 */}
      <ConfirmationModal
        isOpen={modalType !== null}
        onRequestClose={() => setModalType(null)}
        onConfirm={handleModalConfirm}
        title={modalType === 'report' ? '트랙 리포트 열람' : modalType === 'agreement' ? '합의서 인증 발행' : ''}
        message={modalType === 'report'
          ? '리커넥트 케어 무료 이벤트 중입니다.\n무료구독으로 자유롭게 이용하세요.'
          : modalType === 'agreement'
            ? '리커넥트 케어 무료 이벤트 중입니다.\n무료구독으로 자유롭게 이용하세요.'
            : ''}
        confirmButtonText="확인"
        showCancelButton={false}
      />
    </>
  );
};

export default SubscribePage;