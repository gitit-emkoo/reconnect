// src/pages/EmotionCard.tsx (백엔드 연동 수정)
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import BackButton from "../components/common/BackButton";
import SubmitButton from "../components/common/SubmitButton";
import ConfirmationModal from '../components/common/ConfirmationModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';

// 아이콘 (SVG 등 사용 가능, 여기서는 텍스트로 대체)
const SparkleIcon = () => <span style={{ marginRight: "0.5rem" }}>✨</span>;

// 탭 UI 스타일
const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  border-bottom: 2px solid #e5e7eb;
  width: 100%;
  max-width: 600px;
`;
const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem 0;
  background: none;
  border: none;
  border-bottom: 3px solid ${({ active }) => (active ? '#7C3AED' : 'transparent')};
  color: ${({ active }) => (active ? '#7C3AED' : '#888')};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s;
`;
const NewBadge = styled.span`
  display: inline-block;
  background: #ef4444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 2px 7px;
  margin-left: 6px;
  vertical-align: middle;
`;

// SentMessage 타입 정의 (백엔드 응답 기준)
interface SentMessage {
  id: string; // 서버에서 생성된 ID (문자열로 가정)
  text: string;
  createdAt: string; // 서버에서 내려오는 타임스탬프 (ISO 문자열로 가정)
  emoji?: string; // 이모지(선택)
  isRead?: boolean; // 읽음 여부(선택)
  message?: string; // 백엔드 호환(선택)
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

// 카드 겹치기 UI 스타일
const CardGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: flex-start;
  margin-top: 1.5rem;
`;
const CardRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  min-height: 110px;
`;
const OverlapCard = styled.div<{ isHovered: boolean }>`
  width: 70px;
  height: 100px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.10);
  margin-left: -22px;
  z-index: ${({ isHovered }) => (isHovered ? 10 : 1)};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  transition: transform 0.18s, z-index 0.18s, box-shadow 0.18s;
  transform: ${({ isHovered }) => (isHovered ? 'scale(1.15) translateY(-10px)' : 'none')};
  box-shadow: ${({ isHovered }) => (isHovered ? '0 8px 24px rgba(0,0,0,0.18)' : '0 4px 12px rgba(0,0,0,0.10)')};
`;
const CardEmoji = styled.span`
  font-size: 2.2rem;
  margin-bottom: 0.2rem;
`;
const CardDate = styled.span`
  font-size: 0.85rem;
  color: #888;
`;
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 0 0.5rem 0;
`;
const PaginationButton = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.9rem;
  font-size: 1rem;
  color: #7C3AED;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #e0e7ff;
  }
  &:disabled {
    color: #bbb;
    background: #f3f4f6;
    cursor: not-allowed;
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

// 카드 리스트를 7개씩 2차원 배열로 나누는 함수
function chunkCards<T>(cards: T[], chunkSize: number) {
  const result: T[][] = [];
  for (let i = 0; i < cards.length; i += chunkSize) {
    result.push(cards.slice(i, i + chunkSize));
  }
  return result;
}

// 카드 아이템 컴포넌트 분리 (map 내부 useState 제거)
const CardItem = ({ msg, onClick, showNewBadge = false }: { msg: SentMessage, onClick: () => void, showNewBadge?: boolean }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <OverlapCard
      key={msg.id}
      isHovered={hovered}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <CardEmoji>{msg.emoji || '❤️'}</CardEmoji>
      <CardDate>{new Date(msg.createdAt).toLocaleDateString()}</CardDate>
      {showNewBadge && <NewBadge>NEW</NewBadge>}
    </OverlapCard>
  );
};

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('❤️');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [tab, setTab] = useState<'sent' | 'received'>('sent');
  const [receivedMessages, setReceivedMessages] = useState<SentMessage[]>([]);
  const [isLoadingReceived, setIsLoadingReceived] = useState(false);
  const [sentPage, setSentPage] = useState(1);
  const [receivedPage, setReceivedPage] = useState(1);
  const CARDS_PER_ROW = 7;
  const ROWS_PER_PAGE = 5;
  const CARDS_PER_PAGE = CARDS_PER_ROW * ROWS_PER_PAGE;

  // 카드 목록 불러오기
  useEffect(() => {
    const fetchSentMessages = async () => {
      setIsLoadingCards(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        console.log('[EmotionCard] GET /emotion-cards 요청', {
          url: `${API_BASE_URL}/emotion-cards`,
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        const response = await fetch(`${API_BASE_URL}/emotion-cards`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        console.log('[EmotionCard] 응답 status:', response.status);
        const text = await response.text();
        try {
          const data: SentMessage[] = JSON.parse(text);
          console.log('[EmotionCard] 응답 데이터:', data);
          // message 필드를 text로 매핑 (백엔드 호환)
          const mapped = data.map(card => ({
            ...card,
            text: card.text || card.message || '',
          }));
          setSentMessages(mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); // 최신순 정렬
        } catch (parseError) {
          console.error('[EmotionCard] JSON 파싱 에러:', parseError, text);
          throw new Error('감정 카드 목록 응답 파싱 실패');
        }
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

  // 받은 카드 불러오기
  const fetchReceivedMessages = async () => {
    setIsLoadingReceived(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId'); // 실제 로그인 유저 id로 교체 필요
      if (!userId) throw new Error('userId가 필요합니다.');
      const response = await fetch(`${API_BASE_URL}/emotion-cards/received?userId=${userId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const text = await response.text();
      const data: SentMessage[] = JSON.parse(text);
      const mapped = data.map(card => ({ ...card, text: card.text || card.message || '' }));
      setReceivedMessages(mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      setError('받은 카드 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoadingReceived(false);
    }
  };

  // 탭 변경 시 받은카드 fetch
  useEffect(() => {
    if (tab === 'received') fetchReceivedMessages();
  }, [tab]);

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
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/emotion-cards/refine-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
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

  // handleSubmit 분리: 실제 전송 로직
  const doSubmit = async () => {
    if (message.trim().length === 0) {
      setError("보낼 메시지를 입력해주세요.");
      return;
    }
    if (!selectedEmoji) {
      setError("이모지를 선택해주세요.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/emotion-cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ text: message, emoji: selectedEmoji }),
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
      setSelectedEmoji('❤️');
    } catch (err) {
      if (err instanceof Error) { setError(err.message); } else { setError("카드 전송 중 알 수 없는 오류 발생"); }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 보내기 버튼 클릭 시 컨펌 모달 오픈
  const handleSubmit = () => {
    if (message.trim().length === 0) {
      setError("보낼 메시지를 입력해주세요.");
      return;
    }
    setIsConfirmOpen(true);
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
          {/* 이모지 미리보기 및 선택 버튼 */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
            <span style={{ fontSize: '2rem', cursor: 'pointer' }} onClick={() => setShowEmojiPicker(v => !v)}>
              {selectedEmoji ? selectedEmoji : '❤️'}
            </span>
            <button type="button" onClick={() => setShowEmojiPicker(v => !v)} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '0.3rem 0.8rem', background: '#fafafa', cursor: 'pointer' }}>
              {selectedEmoji ? '이모지 변경' : '이모지 선택'}
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
              width="150px"
            >
              {isLoading ? "AI가 다듬는 중..." : (suggestion ? "AI 다른 제안 보기" : "AI 말투 다듬기")}
            </SubmitButton>
            <SubmitButton 
              onClick={handleSubmit} 
              disabled={isSubmitting || isLoading || message.trim().length === 0}
              size="small"
              width="150px"
            >
              {isSubmitting ? "전송 중..." : "보내기"}
            </SubmitButton>
          </ButtonGroup>
        </ContentWrapper>

        {/* === 탭 UI를 카드 리스트 위에 추가 === */}
        <TabsContainer>
          <TabButton active={tab === 'sent'} onClick={() => setTab('sent')}>보낸 카드</TabButton>
          <TabButton active={tab === 'received'} onClick={() => setTab('received')}>
            받은 카드
            {tab !== 'received' && receivedMessages.some(msg => msg.isRead === false) && <NewBadge>NEW</NewBadge>}
          </TabButton>
        </TabsContainer>

        {/* 카드 목록 로딩 시 스피너 */}
        {isLoadingCards && <LoadingSpinner size={48} />}
        {/* 카드 전송 시 스피너 (ContentWrapper 아래에 중첩 표시) */}
        {isSubmitting && <LoadingSpinner size={48} />}
        {/* 카드 목록: 이모지+날짜만 간단히 표시, 클릭 시 모달 */}
        {tab === 'sent' && !isLoadingCards && sentMessages.length > 0 && (
          <SentCardsSection>
            <SentCardsTitle>내가 보낸 감정 카드</SentCardsTitle>
            <CardGridWrapper>
              {chunkCards(sentMessages.slice((sentPage-1)*CARDS_PER_PAGE, sentPage*CARDS_PER_PAGE), CARDS_PER_ROW).map((row, rowIdx) => (
                <CardRow key={rowIdx}>
                  {row.map((msg) => (
                    <CardItem
                      key={msg.id}
                      msg={msg}
                      onClick={() => openModal(msg)}
                    />
                  ))}
                </CardRow>
              ))}
            </CardGridWrapper>
            {/* 페이지네이션 */}
            {sentMessages.length > CARDS_PER_PAGE && (
              <PaginationWrapper>
                <PaginationButton onClick={() => setSentPage(p => Math.max(1, p-1))} disabled={sentPage === 1}>&lt;</PaginationButton>
                <span>{sentPage} / {Math.ceil(sentMessages.length / CARDS_PER_PAGE)}</span>
                <PaginationButton onClick={() => setSentPage(p => Math.min(Math.ceil(sentMessages.length / CARDS_PER_PAGE), p+1))} disabled={sentPage === Math.ceil(sentMessages.length / CARDS_PER_PAGE)}>&gt;</PaginationButton>
              </PaginationWrapper>
            )}
          </SentCardsSection>
        )}
        {tab === 'sent' && !isLoadingCards && !error && sentMessages.length === 0 && (
          <SentCardsSection>
            <SentCardsTitle>내가 보낸 감정 카드</SentCardsTitle>
            <p>아직 작성한 카드가 없습니다.</p>
          </SentCardsSection>
        )}
        {tab === 'received' && !isLoadingReceived && !error && Array.isArray(receivedMessages) && receivedMessages.length === 0 && (
          <SentCardsSection>
            <SentCardsTitle>내가 받은 감정 카드</SentCardsTitle>
            <p>아직 받은 카드가 없습니다.</p>
          </SentCardsSection>
        )}
        {tab === 'received' && !isLoadingReceived && receivedMessages.length > 0 && (
          <SentCardsSection>
            <SentCardsTitle>내가 받은 감정 카드</SentCardsTitle>
            <CardGridWrapper>
              {chunkCards(receivedMessages.slice((receivedPage-1)*CARDS_PER_PAGE, receivedPage*CARDS_PER_PAGE), CARDS_PER_ROW).map((row, rowIdx) => (
                <CardRow key={rowIdx}>
                  {row.map((msg) => (
                    <CardItem
                      key={msg.id}
                      msg={msg}
                      onClick={() => openModal(msg)}
                      showNewBadge={msg.isRead === false}
                    />
                  ))}
                </CardRow>
              ))}
            </CardGridWrapper>
            {/* 페이지네이션 */}
            {receivedMessages.length > CARDS_PER_PAGE && (
              <PaginationWrapper>
                <PaginationButton onClick={() => setReceivedPage(p => Math.max(1, p-1))} disabled={receivedPage === 1}>&lt;</PaginationButton>
                <span>{receivedPage} / {Math.ceil(receivedMessages.length / CARDS_PER_PAGE)}</span>
                <PaginationButton onClick={() => setReceivedPage(p => Math.min(Math.ceil(receivedMessages.length / CARDS_PER_PAGE), p+1))} disabled={receivedPage === Math.ceil(receivedMessages.length / CARDS_PER_PAGE)}>&gt;</PaginationButton>
              </PaginationWrapper>
            )}
          </SentCardsSection>
        )}
        {tab === 'received' && isLoadingReceived && <LoadingSpinner size={48} />}

      </PageContainer>

      {/* 카드 상세 모달: 이모지+내용 */}
      {isModalOpen && selectedMessage && (
        <ModalBackground onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <h4>내가 보낸 감정 카드</h4>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{selectedMessage.emoji || '❤️'}</span>
              <div
                style={{
                  maxHeight: '180px',
                  overflowY: 'auto',
                  marginBottom: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '0.5rem 0',
                  textAlign: 'center',
                  wordBreak: 'break-all',
                  lineHeight: 1.6,
                }}
              >
                {selectedMessage.text}
              </div>
              <span style={{ color: '#888', fontSize: '0.95rem' }}>보낸 시간: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
            </div>
          </ModalContent>
        </ModalBackground>
      )}

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onRequestClose={() => setIsConfirmOpen(false)}
        onConfirm={() => { setIsConfirmOpen(false); doSubmit(); }}
        title="감정카드 전송 안내"
        message={"감정카드는 한 번 보내면 수정이나 삭제가 불가능합니다. 정말로 보내시겠습니까?"}
        confirmButtonText="네, 보낼래요"
        cancelButtonText="취소"
      />

      <NavigationBar />
    </>
  );
};

// 토글로 보낸카드, 받은카드 리스트업 할수있게 하기. 
export default EmotionCard;