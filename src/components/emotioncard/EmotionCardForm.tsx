import React, { useState } from 'react';
import styled from 'styled-components';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import SubmitButton from '../common/SubmitButton';

const ContentWrapper = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 600px;
  margin-top: 1rem; // PageHeaderContainer와의 추가 간격 (선택 사항)
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px; // 높이 증가
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  color: #4a5568;
  resize: vertical; // 세로 크기만 조절 가능

  &:focus {
    outline: none;
    border-color: #3b82f6; // 프로젝트 주요 색상 (예시: blue-500)
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
`;

const SuggestionContainer = styled.div`
  background-color: #f0f9ff; // 연한 하늘색 배경 (예시: sky-50)
  border: 1px solid #bae6fd; // 연한 하늘색 테두리 (예시: sky-200)
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  color: #0c4a6e; // 어두운 하늘색 텍스트 (예시: sky-800)
`;

const SuggestionHeader = styled.p`
  font-weight: 500;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
`;

const SuggestionText = styled.p`
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #ef4444; // Tailwind red-500
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end; // 버튼 그룹을 오른쪽으로 정렬
  align-items: center;
  flex-wrap: wrap; // 너비가 부족할 경우 줄바꿈 (필요시)
`;

const TextButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  background-color: transparent;
  color: #3b82f6; // blue-500
  transition: background-color 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: rgba(59, 130, 246, 0.1); // 연한 파란색 배경
  }

  &:disabled {
    background-color: transparent;
    color: #94a3b8; // Tailwind slate-400
    cursor: not-allowed;
  }
`;

const SparkleIcon = () => <span style={{ marginRight: "0.5rem" }}>✨</span>;

interface EmotionCardFormProps {
  message: string;
  setMessage: (message: string) => void;
  selectedEmoji: string;
  setSelectedEmoji: (emoji: string) => void;
  suggestion: string | null;
  suggestionError: string;
  isSuggesting: boolean;
  isSubmitting: boolean;
  onSuggest: () => void;
  onApplySuggestion: () => void;
  onSubmit: () => void;
}

const EmotionCardForm: React.FC<EmotionCardFormProps> = ({
  message,
  setMessage,
  selectedEmoji,
  setSelectedEmoji,
  suggestion,
  suggestionError,
  isSuggesting,
  isSubmitting,
  onSuggest,
  onApplySuggestion,
  onSubmit,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <ContentWrapper>
      {/* 이모지 미리보기 및 선택 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
        <span style={{ fontSize: '2rem', cursor: 'pointer' }} onClick={() => setShowEmojiPicker(v => !v)}>
          {selectedEmoji || '❤️'}
        </span>
        <button type="button" onClick={() => setShowEmojiPicker(v => !v)} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '0.3rem 0.8rem', background: '#fafafa', cursor: 'pointer' }}>
          {selectedEmoji ? '다시 클릭하고 이모지를 수정해보세요' : '전하고 싶은 감정을 선택하세요'}
        </button>
      </div>
      {showEmojiPicker && (
        <div style={{ marginBottom: '1rem', zIndex: 100 }}>
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setSelectedEmoji(emojiData.emoji);
              setShowEmojiPicker(false);
            }}
            searchDisabled={false}
            skinTonesDisabled={false}
            width="100%"
            height={350}
            lazyLoadEmojis={true}
            previewConfig={{ showPreview: false }}
            emojiStyle={EmojiStyle.NATIVE}
          />
        </div>
      )}
      <TextArea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="오늘 느낀 감정을 파트너에게 전달해보세요. AI가 따뜻한 말로 다듬어 줄 거예요. 가능한 상황에 대해 자세히 써주시면 AI가 상황을 판단하고 더 자연스럽게 바꿔줄거에요."
        disabled={isSuggesting || isSubmitting}
      />

      {suggestionError && <ErrorMessage>{suggestionError}</ErrorMessage>}

      {suggestion && (
        <SuggestionContainer>
          <SuggestionHeader>
            <SparkleIcon /> AI 추천 메시지
          </SuggestionHeader>
          <SuggestionText>{suggestion}</SuggestionText>
          <TextButton
            onClick={onApplySuggestion}
            disabled={isSuggesting || isSubmitting}
            style={{ alignSelf: "flex-start" }} // 왼쪽 정렬
          >
            이 내용 사용하기
          </TextButton>
        </SuggestionContainer>
      )}

      <ButtonGroup>
        <SubmitButton
          onClick={onSuggest}
          disabled={isSuggesting || isSubmitting || message.trim().length === 0}
          size="small"
          width="150px"
        >
          {isSuggesting ? "AI가 다듬는 중..." : (suggestion ? "AI 다른 제안 보기" : "AI 말투 다듬기")}
        </SubmitButton>
        <SubmitButton
          onClick={onSubmit}
          disabled={isSubmitting || isSuggesting || message.trim().length === 0}
          size="small"
          width="150px"
        >
          {isSubmitting ? "전송 중..." : "보내기"}
        </SubmitButton>
      </ButtonGroup>
    </ContentWrapper>
  );
};

export default EmotionCardForm;
