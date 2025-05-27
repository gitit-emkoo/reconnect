import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  background-color: #fefce8;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #78350f;
`;

const MoodSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Mood = styled.button<{ selected: boolean }>`
  font-size: 1.5rem;
  background-color: ${({ selected }) => (selected ? '#fde68a' : '#fff7ed')};
  border: 2px solid #fcd34d;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid #d4d4d8;
  margin-bottom: 1rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  gap: 0.5rem;
`;

const Button = styled.button`
  background-color: #f59e0b;
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
`;

const EmotionDiary: React.FC = () => {
  const [mood, setMood] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [anonymous, setAnonymous] = useState(true);

  const handleSubmit = () => {
    alert(`감정일기 전송됨\n기분: ${mood}\n내용: ${text}\n익명: ${anonymous}`);
  };

  return (
    <Container>
      <Title>오늘의 감정일기</Title>
      <MoodSelector>
        {['😞', '😐', '🙂', '😄'].map((m) => (
          <Mood key={m} onClick={() => setMood(m)} selected={m === mood}>
            {m}
          </Mood>
        ))}
      </MoodSelector>
      <TextArea
        placeholder="오늘 느낀 감정을 자유롭게 적어보세요"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Footer>
        <Label>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
          />
          익명으로 전송하기
        </Label>
        <Button onClick={handleSubmit}>보내기</Button>
      </Footer>
    </Container>
  );
};

export default EmotionDiary;
