// src/pages/EmotionCard.tsx (백엔드 연동 수정)
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import BackButton from "../components/common/BackButton";
import SubmitButton from "../components/common/SubmitButton";

// 아이콘 (SVG 등 사용 가능, 여기서는 텍스트로 대체)
const SparkleIcon = () => <span style={{ marginRight: "0.5rem" }}>✨</span>;

// SentMessage 타입 정의 (백엔드 응답 기준)
interface SentMessage {
  id: string; // 서버에서 생성된 ID (문자열로 가정)
  text: string;
  createdAt: string; // 서버에서 내려오는 타임스탬프 (ISO 문자열로 가정)
  // 필요하다면 userId 등 추가 필드 정의 가능
}

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f0f4f8; // 부드러운 배경색
  padding: 2rem;
  padding-bottom: 8rem; // 하단 패딩 추가 (네비게이션 바 고려, 기존 2rem + 추가 6rem)
  display: flex;
  flex-direction: column;
  align-items: center; // 자식 요소들을 가로축 중앙 정렬 (PageHeaderContainer, ContentWrapper)
  // justify-content: center; // 전체 페이지 세로 중앙 정렬은 일단 보류 (타이틀/백버튼 묶음을 상단에 가깝게)
  box-sizing: border-box; // 패딩과 테두리가 min-height에 포함되도록 설정
  overflow-y: auto; // 내용이 길어질 경우 세로 스크롤 허용
`;

// 뒤로가기 버튼과 페이지 타이틀을 묶는 컨테이너
const PageHeaderContainer = styled.div`
  display: flex;
  align-items: center; // BackButton과 PageTitle을 세로 중앙 정렬
  justify-content: center; // 내부 요소들을 가로 중앙에 배치 (타이틀 기준)
  width: 100%; // PageContainer의 align-items:center에 의해 중앙 정렬되도록 너비 확보
  max-width: 600px; // ContentWrapper와 동일한 최대 너비로 일관성 유지
  margin-bottom: 1.5rem; // ContentWrapper와의 간격
  position: relative; // BackButton을 왼쪽에 배치하기 위한 기준점
`;

const StyledBackButton = styled(BackButton)`
  position: absolute; // PageHeaderContainer를 기준으로 절대 위치
  left: 0; // 왼쪽에 배치
  top: 50%; // 세로 중앙 정렬 시도
  transform: translateY(-50%); // 세로 중앙 정렬 시도
`;

const PageTitle = styled.h2`
  font-size: 1.75rem; // 기본 글씨 크기
  font-weight: 600;
  color: #2d3748;
  text-align: center;
  // margin-bottom 제거 (PageHeaderContainer에서 관리)
  // PageHeaderContainer의 justify-content:center로 인해 중앙 정렬됨

  @media (max-width: 768px) { // 모바일 화면 크기 (예: 768px 이하)
    font-size: 1.2rem; // 모바일에서 글씨 크기 조정
  }
`;

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

// 카드 목록 및 모달을 위한 스타일 추가
const SentCardsSection = styled.section`
  width: 100%;
  max-width: 600px;
  margin-top: 2rem;
`;

const SentCardsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const SentCardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); // 반응형 그리드
  gap: 1rem;
`;

const SentCardItem = styled.div`
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }

  p {
    font-size: 0.875rem;
    color: #4a5568;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.5rem;
  }

  span {
    font-size: 0.75rem;
    color: #718096;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; // NavigationBar보다 위에 오도록
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  position: relative;

  h4 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    white-space: pre-wrap; // 줄바꿈 유지
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4a5568;

  &:hover {
    color: #1a202c;
  }
`;

// API Base URL (환경 변수 등에서 관리하는 것이 좋음)
const API_BASE_URL = "https://reconnect-backend.onrender.com/api"; 

const EmotionCard: React.FC = () => {
  const [message, setMessage] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // AI 제안 로딩
  const [isSubmitting, setIsSubmitting] = useState(false); // 카드 전송 로딩
  const [error, setError] = useState<string | null>(null);
  
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false); // 카드 목록 로딩
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<SentMessage | null>(null);

  // 카드 목록 불러오기
  useEffect(() => {
    const fetchSentMessages = async () => {
      setIsLoadingCards(true);
      setError(null);
      try {
        // 실제로는 인증 토큰 등을 헤더에 포함해야 함
        const response = await fetch(`${API_BASE_URL}/emotion-cards`); 
        if (!response.ok) {
          throw new Error('감정 카드 목록을 불러오는데 실패했습니다.');
        }
        const data: SentMessage[] = await response.json();
        setSentMessages(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); // 최신순 정렬
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("알 수 없는 오류로 카드 목록을 불러오지 못했습니다.");
        }
      } finally {
        setIsLoadingCards(false);
      }
    };
    fetchSentMessages();
  }, []);

  const handleSuggest = async () => {
    if (message.trim().length === 0) {
      setError("감정을 입력한 후 제안을 받아보세요.");
      setSuggestion(null);
      return;
    }
    setIsLoading(true); // AI 제안 로딩 시작
    setError(null);
    setSuggestion(null);
    try {
      const response = await fetch(`${API_BASE_URL}/emotion-cards/refine-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });
      if (!response.ok) {
        let errorMessageText = 'AI 제안을 가져오는데 실패했습니다.';
        try { const errorData = await response.json(); errorMessageText = errorData.message || errorMessageText; } catch (e) {}
        throw new Error(errorMessageText);
      }
      const data = await response.json();
      setSuggestion(data.refinedText);
    } catch (err) {
      if (err instanceof Error) { setError(err.message); } else { setError("AI 제안 중 알 수 없는 오류 발생"); }
      setSuggestion(null);
    } finally {
      setIsLoading(false); // AI 제안 로딩 종료
    }
  };

  const applySuggestion = () => {
    if (suggestion) setMessage(suggestion);
  };

  const handleSubmit = async () => {
    if (message.trim().length === 0) {
      setError("보낼 메시지를 입력해주세요.");
      return;
    }
    setIsSubmitting(true); // 전송 로딩 시작
    setError(null);
    try {
      // 실제로는 인증 토큰 등을 헤더에 포함해야 함
      const response = await fetch(`${API_BASE_URL}/emotion-cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });
      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch(e){}
        throw new Error(errorData?.message || '감정 카드 전송에 실패했습니다.');
      }
      const newCard: SentMessage = await response.json();
      setSentMessages(prevMessages => [newCard, ...prevMessages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setMessage("");
      setSuggestion(null);
    } catch (err) {
      if (err instanceof Error) { setError(err.message); } else { setError("카드 전송 중 알 수 없는 오류 발생"); }
    } finally {
      setIsSubmitting(false); // 전송 로딩 종료
    }
  };

  const openModal = (msg: SentMessage) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  return (
    <>
      <PageContainer>
        <PageHeaderContainer>
          <StyledBackButton /> {/* 스타일링된 BackButton 사용 */}
          <PageTitle>오늘의 감정카드 작성</PageTitle>
        </PageHeaderContainer>
        
        <ContentWrapper>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="오늘 느낀 감정을 파트너에게 전달해보세요. AI가 따뜻한 말로 다듬어 줄 거예요. 가능한 상황에 대해 자세히 써주시면 AI가 상황을 판단하고 더 자연스럽게 바꿔줄거에요."
            disabled={isLoading || isSubmitting}
          />

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {suggestion && (
            <SuggestionContainer>
              <SuggestionHeader>
                <SparkleIcon /> AI 추천 메시지
              </SuggestionHeader>
              <SuggestionText>{suggestion}</SuggestionText>
              <TextButton
                onClick={applySuggestion}
                disabled={isLoading || isSubmitting}
                style={{ alignSelf: "flex-start" }} // 왼쪽 정렬
              >
                이 내용 사용하기
              </TextButton>
            </SuggestionContainer>
          )}

          <ButtonGroup>
            <SubmitButton 
              onClick={handleSuggest} 
              disabled={isLoading || isSubmitting || message.trim().length === 0}
              size="small"
              width="150px" // 너비 150px로 설정
            >
              {isLoading ? "AI가 다듬는 중..." : (suggestion ? "AI 다른 제안 보기" : "AI 말투 다듬기")}
            </SubmitButton>
            <SubmitButton 
              onClick={handleSubmit} 
              disabled={isSubmitting || isLoading || message.trim().length === 0}
              size="small"
              width="150px" // 너비 150px로 설정
            >
              {isSubmitting ? "전송 중..." : "보내기"}
            </SubmitButton>
          </ButtonGroup>
        </ContentWrapper>

        {isLoadingCards && <p>카드 목록을 불러오는 중...</p>}
        {!isLoadingCards && sentMessages.length > 0 && (
          <SentCardsSection>
            <SentCardsTitle>내가 보낸 감정 카드</SentCardsTitle>
            <SentCardList>
              {sentMessages.map(msg => (
                <SentCardItem key={msg.id} onClick={() => openModal(msg)}>
                  <p>{msg.text}</p>
                  <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                </SentCardItem>
              ))}
            </SentCardList>
          </SentCardsSection>
        )}
        {!isLoadingCards && !error && sentMessages.length === 0 && (
            <SentCardsSection>
                <SentCardsTitle>내가 보낸 감정 카드</SentCardsTitle>
                <p>아직 보낸 감정 카드가 없어요.</p>
            </SentCardsSection>
        )}

      </PageContainer>

      {isModalOpen && selectedMessage && (
        <ModalBackground onClick={closeModal}> {/* 배경 클릭 시 닫기 */} 
          <ModalContent onClick={(e) => e.stopPropagation()}> {/* 모달 내용 클릭은 전파 방지 */} 
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <h4>내가 보낸 감정 카드</h4>
            <p>{selectedMessage.text}</p>
            <span>보낸 시간: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
          </ModalContent>
        </ModalBackground>
      )}

      <NavigationBar />
    </>
  );
};


// 토글로 보낸카드, 받은카드 리스트업 할수있게 하기. 
export default EmotionCard;