import React from "react";
import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";

const Container = styled.div`
  background-color: #fff7ed;
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #92400e;
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background-color: white;
  padding: 1.25rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Category = styled.span`
  display: inline-block;
  background-color: #fef3c7;
  color: #b45309;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
`;

const ContentTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.5;
`;

const Locked = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #fef9c3;
  color: #ca8a04;
  font-size: 0.875rem;
  text-align: center;
  border-radius: 0.5rem;
`;

const ContentCenter: React.FC = () => {
  const contents = [
    {
      title: "스킨십이 어색한 부부를 위한 첫 걸음",
      category: "스킨십",
      description: "손을 잡는 것부터 시작하세요. 신체 접촉은 감정을 따르게 만듭니다.",
      locked: false,
    },
    {
      title: "섹스리스 부부를 위한 정서 회복 루틴",
      category: "관계회복",
      description: "스킨십 이전에 감정을 회복하는 것이 핵심입니다. 공감과 대화부터 시작하세요.",
      locked: true,
    },
    {
      title: "거절이 두려운 사람을 위한 접근법",
      category: "소통",
      description: "정중한 제안은 강요가 아닙니다. 타이밍과 환경이 중요합니다.",
      locked: false,
    },
  ];

  return (
    <>
      <Container>
        <Title>맞춤 콘텐츠 추천 📚</Title>
        <Grid>
          {contents.map((item, index) => (
            <Card key={index}>
              <Category>{item.category}</Category>
              <ContentTitle>{item.title}</ContentTitle>
              <Description>{item.description}</Description>
              {item.locked && <Locked>🔒 구독 후 열람 가능</Locked>}
            </Card>
          ))}
        </Grid>
      </Container>
      <NavigationBar />
    </>
  );
};

export default ContentCenter;