import React from 'react';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import styled from 'styled-components';
import NavigationBar from '../components/NavigationBar';

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
  padding: 2rem;
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
  display: inline-block;
  padding: 0.8rem 1.6rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  text-align: center;
  border: none;
  
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
  const handleSubscribe = () => {
    // 구독 로직 구현
    console.log('구독하기 클릭');
  };

  const handleReportView = () => {
    // 리포트 열람 로직 구현
    console.log('리포트 열람 클릭');
  };

  const handleAgreementSave = () => {
    // 합의서 발행 로직 구현
    console.log('합의서 발행 클릭');
  };

  return (
    <>
      <Header title="구독(결제)" />
      <BackButton />
      <Container>
        <ContentContainer>
          {/* 리커넥트케어 구독 */}
          <Section>
            <Title>💙 리커넥트케어 구독</Title>
            <Description>
              감정트랙과 자기이해진단으로 <strong>나의 정서를 케어</strong>하고,<br/>
              리커넥트 보증합의서를 통해 <strong>관계의 현실을 지켜주는</strong> 케어 구독입니다.<br/><br/>
              ✔ 월간 감정트랙 자동 발행<br/>
              ✔ 합의서 무제한 저장 및 PDF 출력<br/>
              ✔ 자기이해진단 포함<br/><br/>
              💳 <strong>월 3,900원 / 첫 달 무료</strong>
            </Description>
            <Button variant="primary" onClick={handleSubscribe}>
              지금 구독하기
            </Button>
          </Section>

          {/* 감정트랙 리포트 단품 */}
          <Section>
            <Title>📘 감정트랙 리포트 (단품)</Title>
            <Description>
              감정일기를 AI가 분석하고 매월 <strong>한 장의 리듬으로 정리하는</strong> 정서적 데이터로<br/>
              상담 · 회고 · 자기 돌봄에 활용할 수 있는 기록입니다.<br/><br/>
              💵 <strong>₩1,000 / 1회 열람권</strong>
            </Description>
            <Button variant="blue" onClick={handleReportView}>
              📘 리포트 열람
            </Button>
          </Section>

          {/* 보증합의서 PDF 단품 */}
          <Section>
            <Title>📄 보증합의서 PDF 저장권</Title>
            <Description>
              서로의 약속과 신뢰에 기반해 <strong>리커넥트가 보증하는</strong> 관계의 정의를 위한 계약이자<br/>
              현실적 대비를 위한 증빙입니다.<br/><br/>
              💵 <strong>₩1,000 / 1회 저장권</strong>
            </Description>
            <Button variant="yellow" onClick={handleAgreementSave}>
              📄 합의서 발행
            </Button>
          </Section>
        </ContentContainer>
      </Container>
      <NavigationBar />
    </>
  );
};

export default SubscribePage;