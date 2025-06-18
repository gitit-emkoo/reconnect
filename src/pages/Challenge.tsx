import React from "react";
import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import MobileOnlyBanner from '../components/common/MobileOnlyBanner';
import Popup from '../components/common/Popup';
import { formatInKST } from '../utils/date';

const Container = styled.div`
  background: #f9fafb;
  min-height: 100vh;
  padding: 2.5rem 0 6rem 0;
  @media (max-width: 600px) {
    padding: 1.2rem 0 5rem 0;
  }
`;

const GuideText = styled.div`
  text-align: center;
  font-size: 1.15rem;
  color: #444;
  margin-bottom: 2.2rem;
  font-weight: 500;
  @media (max-width: 600px) {
    font-size: 1rem;
    margin-bottom: 1.2rem;
  }
`;

const ChallengeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem 1.2rem;
  max-width: 700px;
  margin: 0 auto;
  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 0.7rem 0.5rem;
    max-width: 98vw;
  }
`;

const Card = styled.div<{ bg: string }>`
  background: ${({ bg }) => bg};
  border-radius: 1.1rem;
  padding: 1rem 0.7rem 0.8rem 0.7rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0 2px 8px #0001;
  @media (max-width: 600px) {
    padding: 0.7rem 0.5rem 0.6rem 0.5rem;
  }
`;
const CardIcon = styled.span`
  font-size: 1.3rem;
  margin-bottom: 0.4rem;
`;
const CardTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #222;
  display: flex;
  align-items: center;
`;
const CardDesc = styled.div`
  font-size: 0.92rem;
  color: #444;
  margin-bottom: 0.7rem;
`;
const CardButton = styled.button<{ color: string }>`
  background: ${({ color }) => color};
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.7rem;
  padding: 0.5rem 1rem;
  font-size: 0.92rem;
  margin-top: auto;
  box-shadow: 0 2px 8px #0001;
  cursor: pointer;
  &:hover { opacity: 0.92; }
`;

const challengeList = [
  {
    icon: "💬", title: "일상 공유", desc: "작은 말 한마디가 큰 정서적 연결을 만듭니다.", bg: "#fff3d6", btn: "챌린지 시작", btnColor: "#ffa940"
  },
  {
    icon: "🍽️", title: "함께 하기", desc: "공동 활동을 통해 정서적 유대감을 키우는 주간.", bg: "#fdf6e3", btn: "챌린지 보기", btnColor: "#bfa16c"
  },
  {
    icon: "💗", title: "감정 표현", desc: "말로 표현하는 감정은 마음을 더욱 가깝게 합니다", bg: "#ffe3ea", btn: "챌린지 보기", btnColor: "#ff6b81"
  },
  {
    icon: "📸", title: "기억 쌓기", desc: "추억은 감정을 단단하게 붙들어주는 접착제입니다", bg: "#fff3b0", btn: "챌린지 보기", btnColor: "#ffc300"
  },
  {
    icon: "🪷", title: "마음 돌보기", desc: "내 마음을 먼저 살피는 것이 관계 회복의 시작입니다", bg: "#f5e6fa", btn: "챌린지 보기", btnColor: "#b983ff"
  },
  {
    icon: "🏃‍♂️", title: "함께 성장", desc: "같은 방향을 보는 것이 관계의 본질입니다", bg: "#d6f7f6", btn: "챌린지 보기", btnColor: "#38b6b6"
  },
];

const Challenge: React.FC = () => {
  const todayKey = 'challenge_popup';
  const today = new Date();
  const ymd = formatInKST(today, 'yyyyMMdd');
  const hideToday = typeof window !== 'undefined' && localStorage.getItem(`${todayKey}_${ymd}`) === 'true';
  const [showPopup, setShowPopup] = React.useState(!hideToday);
  return (
    <>
      <MobileOnlyBanner />
      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="챌린지 안내"
        emoji="🏆"
        description={<>
          커플 챌린지에 참여하고<br />
          서로의 마음을 더 가까이 느껴보세요!<br />
        </>}
        buttonText="챌린지 시작하기"
        onButtonClick={() => setShowPopup(false)}
        todayKey="challenge_popup"
      />
      <Container>
        <GuideText>주제별 챌린지에 참여하고 감정 온도를 높여보세요.</GuideText>
        <ChallengeGrid>
          {challengeList.map((c, i) => (
            <Card key={i} bg={c.bg}>
              <CardIcon>{c.icon}</CardIcon>
              <CardTitle>{c.title}</CardTitle>
              <CardDesc>{c.desc}</CardDesc>
              <CardButton color={c.btnColor}>{c.btn}</CardButton>
            </Card>
          ))}
        </ChallengeGrid>
      </Container>
      <NavigationBar />
    </>
  );
};

export default Challenge;
