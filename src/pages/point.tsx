import React from 'react';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import styled from 'styled-components';
import NavigationBar from '../components/NavigationBar';

const Container = styled.div`
  background-color: #f5f7fb;
  min-height: 100vh;
  padding: 2rem;
  padding-bottom: 70px; /* NavigationBar 높이만큼 패딩 */
  font-family: 'Pretendard', sans-serif;
  color: #222;
`;

const Wrap = styled.div`
  max-width: 680px;
  margin: 0 auto;
  background: white;
  padding: 2.4rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
`;

const Emoji = styled.div`
  font-size: 2.4rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: 0.6rem;
  text-align: center;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: center;
`;

const InfoList = styled.div`
  background: #f0f3ff;
  padding: 1.4rem;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 2rem;
  
  strong {
    color: #4455aa;
  }
`;

const Notice = styled.p`
  font-size: 0.85rem;
  color: #999;
  text-align: center;
  margin-top: 1rem;
`;

const PointPage: React.FC = () => {
  return (
    <>
      <Header title="포인트(코인)" />
      <BackButton />
      <Container>
        <Wrap>
          <Emoji>🪙</Emoji>
          <Title>리코인은 곧 시작될 보상 시스템입니다</Title>
          <Description>
            나, 그리고 관계 회복에 진심인 사용자에게<br/>
            리커넥트는 또 하나의 가치를 부여하고자 합니다.
          </Description>
          
          <InfoList>
            📌 <strong>리코인은 무엇인가요?</strong><br/>
            감정기록, 챌린지달성, 커뮤니티 활동 등 정서적 활동을<br/>
            지속적으로 이어온 사용자에게 발행되는 코인형 리워드입니다<br/><br/>
            
            🧩 <strong>앞으로 어떻게 사용할 수 있나요?</strong><br/>
            - 리커넥트에서 결제 시 활용 <br/>
            - 리코인으로만 사용가능한 기능 잠금해제<br/>
            - 제휴처에서 포인트 사용<br/>
            - 차후 시장 상장 시 보유가치
          </InfoList>
          
          <Notice>
            ※ 리코인 기능은 현재 준비 중이며,<br/>
            곧 업데이트를 통해 오픈 예정입니다.
          </Notice>
        </Wrap>
      </Container>
      <NavigationBar />
    </>
  );
};

export default PointPage;