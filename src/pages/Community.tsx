// src/pages/Community.tsx
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #f7f3f0; /* 따뜻한 회색 계열 */
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #795548; /* 브라운 계열 */
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #5d4037;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #6d4c41;
  line-height: 1.5;
`;

const Button = styled.button`
  background-color: #8d6e63;
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  margin-top: 1rem;
  &:hover {
    background-color: #6d4c41;
  }
`;

const Community: React.FC = () => {
  return (
    <Container>
      <Title>커뮤니티 👥</Title>
      <Card>
        <SectionTitle>따뜻한 교류의 장</SectionTitle>
        <Text>
          비슷한 고민을 가진 다른 사용자들과 경험을 공유하고, 서로에게 힘이 되어줄 수 있는 공간입니다. 익명으로 안전하게 소통해보세요.
        </Text>
        <Button>게시글 작성</Button>
      </Card>
      <Card>
        <SectionTitle>최신 게시글</SectionTitle>
        <Text style={{ marginBottom: '0.5rem' }}>
          - [고민] "요즘 배우자와 대화가 줄었어요..."
        </Text>
        <Text style={{ marginBottom: '0.5rem' }}>
          - [팁] "저희 부부의 챌린지 성공 비법!"
        </Text>
        <Text>
          - [질문] "감정카드, 어떻게 활용하면 좋을까요?"
        </Text>
      </Card>
    </Container>
  );
};

export default Community;