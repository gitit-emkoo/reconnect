import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background-color: #ecfeff;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #0369a1;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const SuggestionBox = styled.div`
  background-color: #e0f2fe;
  border-left: 4px solid #0284c7;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  color: #075985;
  font-size: 0.95rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  background-color: #0284c7;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background-color: #0369a1;
  }
`;

const EmotionCard: React.FC = () => {
  const [message, setMessage] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const handleSuggest = () => {
    if (message.trim().length === 0) {
      setSuggestion("감정을 입력한 후 제안을 받아보세요.");
    } else {
      setSuggestion("오늘 하루 수고했어. 너와 함께 하는 하루가 나에게는 소중해.");
    }
  };

  const handleSubmit = () => {
    alert(`감정카드 전송 완료\n내용: ${message}`);
  };

  return (
    <Container>
      <Title>오늘의 감정카드 작성</Title>
      <TextArea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="오늘 느낀 감정을 짧게 표현해보세요."
      />
      {suggestion && <SuggestionBox>✨ AI 제안: {suggestion}</SuggestionBox>}
      <ButtonGroup>
        <Button onClick={handleSuggest}>AI 말투 다듬기</Button>
        <Button onClick={handleSubmit}>보내기</Button>
      </ButtonGroup>
    </Container>
  );
};

export default EmotionCard;