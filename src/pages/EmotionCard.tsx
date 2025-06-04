// src/pages/EmotionCard.tsx (업데이트된 부분)
import React, { useState } from "react";
import styled from "styled-components";
import NavigationBar from "../components/NavigationBar"; // NavigationBar 임포트

const Container = styled.div`
  padding: 2rem;
  min-height: calc(100vh - 60px); /* NavigationBar 높이만큼 줄임 */
  background-color: #ecfeff;
  padding-bottom: 80px; /* NavigationBar에 가려지지 않도록 하단 패딩 추가 */
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

const ErrorMessage = styled.p`
  color: #ef4444; // Tailwind red-500
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap; // 버튼이 많아질 경우 줄바꿈 허용
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
  &:hover:not(:disabled) {
    background-color: #0369a1;
  }
  &:disabled {
    background-color: #94a3b8; // Tailwind slate-400
    cursor: not-allowed;
  }
`;

// 임시 더미 제안 목록
const dummySuggestions = [
  "오늘 정말 멋진 하루였어! 네 덕분에 힘이 나.",
  "괜찮아, 누구나 그럴 수 있어. 너무 자책하지 마.",
  "네 마음이 조금이나마 편해졌으면 좋겠다.",
  "힘든 일이 있었구나. 내가 옆에 있어줄게.",
  "네 생각을 말해줘서 고마워. 더 이해할 수 있게 됐어.",
];

let suggestionIndex = 0;

const EmotionCard: React.FC = () => {
  const [message, setMessage] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggest = async () => {
    if (message.trim().length === 0) {
      setError("감정을 입력한 후 제안을 받아보세요.");
      setSuggestion(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestion(null); // 이전 제안 숨기기

    // 실제 API 호출 대신 임시 목업 로직
    try {
      //   const response = await fetch('/api/emotion-cards/refine-text', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ text: message }),
      //   });
      //   if (!response.ok) {
      //     const errorData = await response.json();
      //     throw new Error(errorData.message || 'AI 제안을 가져오는데 실패했습니다.');
      //   }
      //   const data = await response.json();
      //   setSuggestion(data.refinedText);

      // 임시 더미 제안 (여러 번 제안 기능 흉내)
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 딜레이
      setSuggestion(dummySuggestions[suggestionIndex]);
      suggestionIndex = (suggestionIndex + 1) % dummySuggestions.length;

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
      setSuggestion(null);
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = () => {
    if (suggestion) {
      setMessage(suggestion);
      // setSuggestion(null); // 제안 적용 후 제안 박스 숨기거나 유지 (선택)
    }
  };

  const handleSubmit = () => {
    // 실제 전송 로직은 여기에 구현
    alert(`감정카드 전송 완료\n내용: ${message}`);
    // 전송 후 상태 초기화 (선택 사항)
    // setMessage("");
    // setSuggestion(null);
    // setError(null);
  };

  return (
    <> {/* Fragment로 감싸서 NavigationBar와 함께 렌더링 */}
      <Container>
        <Title>오늘의 감정카드 작성</Title>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="오늘 느낀 감정을 짧게 표현해보세요."
          disabled={isLoading}
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {suggestion && (
          <SuggestionBox>
            <p style={{ marginBottom: '0.5rem' }}>✨ AI 제안:</p>
            <p>{suggestion}</p>
            <Button
              onClick={applySuggestion}
              style={{ marginTop: '1rem', backgroundColor: '#0ea5e9' }} // Tailwind sky-500
              disabled={isLoading}
            >
              이 제안 적용하기
            </Button>
          </SuggestionBox>
        )}

        <ButtonGroup>
          <Button onClick={handleSuggest} disabled={isLoading || message.trim().length === 0}>
            {isLoading ? "제안 받는 중..." : (suggestion ? "다른 제안 보기" : "AI 말투 다듬기")}
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || message.trim().length === 0}>
            보내기
          </Button>
        </ButtonGroup>
      </Container>
      <NavigationBar /> {/* EmotionCard에서도 NavigationBar 렌더링 */}
    </>
  );
};

export default EmotionCard;