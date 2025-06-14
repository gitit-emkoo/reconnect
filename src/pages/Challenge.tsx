import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useAuthStore from "../store/authStore";
import PartnerRequiredModal from "../components/common/PartnerRequiredModal";
import NavigationBar from "../components/NavigationBar";

const Container = styled.div`
  background: #e9f8f6;
  min-height: 100vh;
  padding: 2rem 0 6rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e3a2a;
  margin: 0 0 1.2rem 0;
  padding-left: 1.5rem;
`;

const MissionCard = styled.div`
  background: #fff;
  border-radius: 1.2rem;
  margin: 0 1.5rem 2rem 1.5rem;
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  box-shadow: 0 4px 16px #0001;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const MissionTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e3a2a;
  margin-bottom: 0.7rem;
`;

const MissionIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.7rem;
`;

const ProgressBarWrap = styled.div`
  width: 100%;
  height: 8px;
  background: #e0f2e9;
  border-radius: 4px;
  margin: 0.7rem 0 1.1rem 0;
  overflow: hidden;
`;
const ProgressBar = styled.div<{ percent: number }>`
  width: ${({ percent }) => percent}%;
  height: 100%;
  background: #10b981;
  border-radius: 4px;
  transition: width 0.3s;
`;

const MissionButton = styled.button`
  background: #10b981;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 1.2rem;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  margin-top: 0.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px #10b98122;
  &:hover { background: #059669; }
`;

const MissionComplete = styled.div`
  color: #16a34a;
  font-weight: bold;
  margin-top: 0.5rem;
`;

const ChallengeGridTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #3b3b3b;
  margin: 0 0 1rem 1.5rem;
`;

const ChallengeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem;
  margin: 0 1.5rem;
`;

const ChallengeCard = styled.div<{ bg: string }>`
  background: ${({ bg }) => bg};
  border-radius: 1.1rem;
  padding: 1.1rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0 2px 8px #0001;
`;
const ChallengeIcon = styled.span`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;
const ChallengeTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
`;
const ChallengeDesc = styled.div`
  font-size: 0.95rem;
  color: #444;
`;

const challengeList = [
  { icon: "💬", title: "대화 늘리기", desc: "하루 3분 감정 이야기 나누기", bg: "#fffbe7" },
  { icon: "💗", title: "감정 표현", desc: "감정카드로 오늘 감정 나누기", bg: "#ffe6ea" },
  { icon: "🐻", title: "소소한 배려", desc: "하루 1번 고마운 행동하기", bg: "#f7f3e8" },
  { icon: "👫", title: "데이트 리추얼", desc: "매주 한 번 함께 산책하기", bg: "#e6f7fa" },
  { icon: "🍽️", title: "식사 공유", desc: "한 끼는 같이 차리기 or 먹기", bg: "#f3f6fa" },
];

const Challenge: React.FC = () => {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState(60);
  const [completed, setCompleted] = useState(false);
  const [showPartnerRequiredModal, setShowPartnerRequiredModal] = useState(false);

  useEffect(() => {
    if (!user?.partner) {
      setShowPartnerRequiredModal(true);
    }
  }, [user?.partner]);

  const handleComplete = () => {
    if (!user?.partner) {
      setShowPartnerRequiredModal(true);
      return;
    }
    setProgress(100);
    setCompleted(true);
  };

  if (!user?.partner) {
    return (
      <>
        <Container>
          <SectionTitle>이번 주 Connect 미션</SectionTitle>
          <MissionCard>
            <MissionTitle>
              <MissionIcon>🍽️</MissionIcon>함께 아침밥 준비하기
            </MissionTitle>
            <ProgressBarWrap>
              <ProgressBar percent={progress} />
            </ProgressBarWrap>
            <MissionButton disabled>오늘 미션 완료!</MissionButton>
          </MissionCard>
        </Container>
        <PartnerRequiredModal 
          open={showPartnerRequiredModal} 
          onClose={() => setShowPartnerRequiredModal(false)} 
        />
        <NavigationBar isSolo={true} />
      </>
    );
  }

  return (
    <>
      <Container>
        <SectionTitle>이번 주 Connect 미션</SectionTitle>
        <MissionCard>
          <MissionTitle>
            <MissionIcon>🍽️</MissionIcon>함께 아침밥 준비하기
          </MissionTitle>
          <ProgressBarWrap>
            <ProgressBar percent={progress} />
          </ProgressBarWrap>
          {!completed ? (
            <MissionButton onClick={handleComplete}>오늘 미션 완료!</MissionButton>
          ) : (
            <MissionComplete>미션 완료! 🎉</MissionComplete>
          )}
        </MissionCard>
        <ChallengeGridTitle>챌린지를 골라보세요</ChallengeGridTitle>
        <ChallengeGrid>
          {challengeList.map((c, i) => (
            <ChallengeCard key={i} bg={c.bg}>
              <ChallengeIcon>{c.icon}</ChallengeIcon>
              <ChallengeTitle>{c.title}</ChallengeTitle>
              <ChallengeDesc>{c.desc}</ChallengeDesc>
            </ChallengeCard>
          ))}
        </ChallengeGrid>
      </Container>
      <PartnerRequiredModal 
        open={showPartnerRequiredModal} 
        onClose={() => setShowPartnerRequiredModal(false)} 
      />
      <NavigationBar isSolo={false} />
    </>
  );
};

//이번주 약속, 미션완료누르면 완료처리되고 온도가 상승함. 
//이런약속 어때요? 각 테마버튼 4개정도. 1번:여행,데이트 2번:스킨쉽 3번:선물(사이트 이동) 4번:일상(존댓말쓰기, 시댁에 전화하기)
//테마버튼 선택하면 모달로 리스트 나오고 선택할수 있음. 확인모달한번더 뜨고 확인누르면 상단에 이번주 미션으로 표시됨
//미션완료버튼 누르면 사진과 코멘트등록하고 사진을 익명으로 공개하시겠습니까? 에 선택가능하게하게 
export default Challenge;
