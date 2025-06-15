// src/pages/EmotionCard.tsx (백엔드 연동 수정)
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import BackButton from "../components/common/BackButton";
import SubmitButton from "../components/common/SubmitButton";
import ConfirmationModal from '../components/common/ConfirmationModal';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import useAuthStore from '../store/authStore';
import axiosInstance from '../api/axios';
import { User } from "../types/user";
import PartnerRequiredModal from '../components/common/PartnerRequiredModal';
import Popup from '../components/common/Popup';
import { isTodayKST } from '../utils/date';
import { useNotificationStore } from '../store/notificationsStore';
import { useEmotionCardNotifications } from '../hooks/useEmotionCardNotifications';

// 배열을 행 단위로 나누는 chunkCards 함수 추가
function chunkCards<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

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
  senderId: string;
  receiverId: string;
  coupleId: string;
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
  margin: 0 auto;
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
  gap: 1rem;
  align-items: start
  margin-top: 1.5rem;
  margin-left: 1rem;
  
`;
const CardRow = styled.div`
  display: flex;
  min-height: 110px;
  gap: 1rem;
  width: 100%;
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
  background-color:     #ffffff;
  padding: 1.5rem;
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

const API_BASE_URL = "https://reconnect-backend.onrender.com/api";

// (fetchSentMessages, fetchReceivedMessages 함수 수정)
export async function fetchSentMessages() {
  const { data } = await axiosInstance.get("/emotion-cards");
  return data;
}

export async function fetchReceivedMessages() {
  const { data } = await axiosInstance.get("/emotion-cards/received");
  return data;
}

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
  width: 100%;
`;

const Select = styled.select`
  padding: 0.4rem 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  font-size: 0.85rem;
  color: #4a5568;
  cursor: pointer;
  min-width: 100px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.8em;
  padding-right: 2rem;
  
  &:focus {
    outline: none;
    border-color: #7C3AED;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
  }

  &:hover {
    border-color: #7C3AED;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// 날짜 포맷팅 유틸리티 함수 추가
const formatDateToKST = (dateString: string) => {
  const date = new Date(dateString);
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kstDate.toISOString().slice(2, 10).replace(/-/g, ".");
};

const EmotionCard: React.FC = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user) as User;
  const myId = user?.id;
  const partnerId = user?.partner?.id;
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [suggestionError, setSuggestionError] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPartnerRequiredModal, setShowPartnerRequiredModal] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [tab, setTab] = useState<'sent' | 'received'>('sent');
  const prevReceivedIds = useRef<string[] | null>(null);

  // 보낸 메시지 쿼리 (파트너 없으면 비활성화)
  const {
    data: sentMessages = [],
    isLoading: isLoadingSent,
    error: sentError,
    refetch: refetchSent,
  } = useQuery<SentMessage[]>({
    queryKey: ['sentMessages', myId, partnerId],
    queryFn: async () => {
      try {
        return await fetchSentMessages();
      } catch (error: any) {
        if (error?.response?.data?.code === 'PARTNER_REQUIRED') {
          setShowPartnerRequiredModal(true);
        }
        throw error;
      }
    },
    enabled: !!partnerId,
  });

  // 받은 메시지 쿼리 (유저 없으면 비활성화)
  const {
    data: receivedMessages = [],
    isLoading: isLoadingReceived,
    error: receivedError,
    refetch: refetchReceived,
  } = useQuery<SentMessage[]>({
    queryKey: ['receivedMessages', myId],
    queryFn: () => fetchReceivedMessages(),
    enabled: !!myId,
    refetchInterval: 5000, // 5초마다 자동 갱신
  });

  // 커스텀 훅 사용
  useEmotionCardNotifications(receivedMessages);

  // 탭 전환 시 refetch
  useEffect(() => {
    if (tab === 'received') {
      refetchReceived();
    } else if (tab === 'sent') {
      refetchSent();
    }
  }, [tab, refetchReceived, refetchSent]);
  
  const [selectedMessage, setSelectedMessage] = useState<SentMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const CARDS_PER_PAGE = 20;
  const CARDS_PER_ROW = 5;

  // === 필터링 추가 ===
  const filteredSentMessages = Array.isArray(sentMessages) ? sentMessages.filter(
    (msg: SentMessage) => msg.senderId === myId
  ) : [];
  
  const filteredReceivedMessages = Array.isArray(receivedMessages) ? receivedMessages.filter(
    (msg: SentMessage) => msg.senderId === partnerId && msg.receiverId === myId
  ) : [];

  // 월별 필터링과 정렬을 위한 함수
  const getFilteredAndSortedMessages = (messages: SentMessage[]) => {
    return messages
      .filter(msg => msg.createdAt.startsWith(selectedMonth))
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  };

  // 사용 가능한 월 목록 생성 (최신순으로 정렬)
  const getAvailableMonths = (messages: SentMessage[]) => {
    const months = new Set(messages.map(msg => msg.createdAt.slice(0, 7)));
    return Array.from(months).sort().reverse();
  };

  // 필터링된 메시지
  const filteredAndSortedSentMessages = getFilteredAndSortedMessages(filteredSentMessages);
  const filteredAndSortedReceivedMessages = getFilteredAndSortedMessages(filteredReceivedMessages);

  const postEmotionCard = async (data: { 
    text: string, 
    emoji: string, 
    senderId: string, 
    receiverId: string, 
    coupleId?: string 
  }) => {
    const response = await axiosInstance.post('/emotion-cards', data);
    if (!response.data) throw new Error('감정카드 전송에 실패했습니다.');
    return response.data;
  };

  const sendCardMutation = useMutation({
    mutationFn: (data: { text: string, emoji: string }) => 
      postEmotionCard({ 
        ...data,
        senderId: myId || '', 
        receiverId: partnerId || '', 
        coupleId: user.couple?.id 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sentMessages'] });
      setMessage("");
      setSelectedEmoji('❤️');
    },
    // optimistic update 예시 (immer 활용)
    onMutate: async ({ text, emoji }) => {
      await queryClient.cancelQueries({ queryKey: ['sentMessages'] });
      const previous = queryClient.getQueryData(['sentMessages']);
      queryClient.setQueryData(['sentMessages'], (old: SentMessage[] | undefined) =>
        produce(old || [], (draft: SentMessage[]) => {
          draft.unshift({
            id: 'temp-' + Date.now(),
            text,
            emoji,
            createdAt: new Date().toISOString(),
            isRead: false,
            senderId: myId || '',
            receiverId: partnerId || '',
            coupleId: '',
          });
        })
      );
      return { previous };
    },
    onError: (_err: unknown, _variables: any, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(['sentMessages'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sentMessages'] });
    }
  });

  const handleSuggest = async () => {
    if (message.trim().length === 0) {
      setSuggestionError("감정을 입력한 후 제안을 받아보세요.");
      setSuggestion(null);
      return;
    }
    setIsSuggesting(true);
    setSuggestionError('');
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
      if (err instanceof Error) { setSuggestionError(err.message); } else { setSuggestionError("AI 제안 중 알 수 없는 오류 발생"); }
      setSuggestion(null);
    } finally {
      setIsSuggesting(false);
    }
  };

  const applySuggestion = () => {
    if (suggestion) setMessage(suggestion);
  };

  const handleSubmit = () => {
    if (!message.trim()) return;
    sendCardMutation.mutate({ text: message, emoji: selectedEmoji });
  };

  const openModal = (msg: SentMessage) => {
    setSelectedMessage(msg);
  };

  const closeModal = () => {
    setSelectedMessage(null);
  };

  // 알림 처리 로직 추가
  useEffect(() => {
    if (receivedMessages && receivedMessages.length > 0) {
      if (prevReceivedIds.current === null) {
        // 최초 마운트: 알림 추가하지 않고 id만 저장
        prevReceivedIds.current = receivedMessages.map((msg: any) => msg.id);
        return;
      }
      const newCards = receivedMessages.filter((msg: any) => !prevReceivedIds.current!.includes(msg.id));
      newCards.forEach(() => {
        useNotificationStore.getState().addNotification('새 감정카드가 도착했어요!', '/emotion-card?tab=received');
      });
      prevReceivedIds.current = receivedMessages.map((msg: any) => msg.id);
    }
  }, [receivedMessages]);

  if (sentError || receivedError) {
    return (
      <PageContainer style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <PageTitle>오류 발생</PageTitle>
        <ErrorMessage>
          데이터를 불러오는 중 오류가 발생했습니다.
          {sentError?.message || receivedError?.message}
        </ErrorMessage>
      </PageContainer>
    );
  }

  if (!partnerId) {
    return (
      <PageContainer>
        <PageHeaderContainer>
          <StyledBackButton />
          <PageTitle>오늘의 감정카드 작성</PageTitle>
        </PageHeaderContainer>
        <ContentWrapper>
          <ErrorMessage>파트너가 연결되어야 감정카드를 사용할 수 있습니다.</ErrorMessage>
        </ContentWrapper>
        <PartnerRequiredModal 
          open={showPartnerRequiredModal} 
          onClose={() => setShowPartnerRequiredModal(false)} 
        />
        <NavigationBar />
      </PageContainer>
    );
  }

  return (
    <>
    <Popup isOpen={showPopup} onClose={() => setShowPopup(false)}>
      <div style={{ whiteSpace: 'pre-line', fontSize: '1rem', fontWeight: 400 }}>
        {`76%가 \n'관계가 이전보다 회복되었다'고 응답했어요`}
      </div>
    </Popup>
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
              {selectedEmoji ? '마음을 표현할 아이콘을 선택해 보세요' : '전하고 싶은 감정을 선택하세요'}
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
            disabled={isSuggesting || sendCardMutation.isPending}
          />

          {suggestionError && <ErrorMessage>{suggestionError}</ErrorMessage>}

          {suggestion && (
            <SuggestionContainer>
              <SuggestionHeader>
                <SparkleIcon /> AI 추천 메시지
              </SuggestionHeader>
              <SuggestionText>{suggestion}</SuggestionText>
              <TextButton
                onClick={applySuggestion}
                disabled={isSuggesting || sendCardMutation.isPending}
                style={{ alignSelf: "flex-start" }} // 왼쪽 정렬
              >
                이 내용 사용하기
              </TextButton>
            </SuggestionContainer>
          )}

          <ButtonGroup>
            <SubmitButton 
              onClick={handleSuggest} 
              disabled={isSuggesting || sendCardMutation.isPending || message.trim().length === 0}
              size="small"
              width="150px"
            >
              {isSuggesting ? "AI가 다듬는 중..." : (suggestion ? "AI 다른 제안 보기" : "AI 말투 다듬기")}
            </SubmitButton>
            <SubmitButton 
              onClick={() => setIsSubmitting(true)} 
              disabled={sendCardMutation.isPending || isSuggesting || message.trim().length === 0}
              size="small"
              width="150px"
            >
              {sendCardMutation.isPending ? "전송 중..." : "보내기"}
            </SubmitButton>
          </ButtonGroup>
        </ContentWrapper>

        {/* === 탭 UI를 카드 리스트 위에 추가 === */}
        <TabsContainer>
          <TabButton active={tab === 'sent'} onClick={() => setTab('sent')}>보낸 카드</TabButton>
          <TabButton active={tab === 'received'} onClick={() => setTab('received')}>
            받은 카드
            {tab !== 'received' && Array.isArray(receivedMessages) && receivedMessages.some((msg: SentMessage) => msg.isRead === false) && <NewBadge>NEW</NewBadge>}
          </TabButton>
        </TabsContainer>

        {/* 카드 목록: 이모지+날짜만 간단히 표시, 클릭 시 모달 */}
        {tab === 'sent' && !isLoadingSent && filteredSentMessages.length > 0 && (
          <SentCardsSection>
            <SentCardsTitle>내가 보낸 감정 카드</SentCardsTitle>
            <FilterContainer>
              <FilterGroup>
                <Select 
                  value={selectedMonth} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMonth(e.target.value)}
                >
                  {getAvailableMonths(filteredSentMessages).map(month => (
                    <option key={month} value={month}>
                      {month.replace('-', '년 ')}월
                    </option>
                  ))}
                </Select>
              </FilterGroup>
              <FilterGroup>
                <Select 
                  value={sortOrder} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                >
                  <option value="newest">최신순</option>
                  <option value="oldest">오래된순</option>
                </Select>
              </FilterGroup>
            </FilterContainer>
            <CardGridWrapper>
              {chunkCards<SentMessage>(filteredAndSortedSentMessages.slice(0, CARDS_PER_PAGE), CARDS_PER_ROW).map((row, rowIdx) => (
                <CardRow key={rowIdx}>
                  {(row as SentMessage[]).map((msg: SentMessage, idx: number, arr) => (
                    <OverlapCard
                      key={msg.id}
                      isHovered={false}
                      style={{ zIndex: arr.length - idx }}
                      onClick={() => openModal(msg)}
                    >
                      <CardEmoji>{msg.emoji || "❤️"}</CardEmoji>
                      <CardDate>{formatDateToKST(msg.createdAt)}</CardDate>
                    </OverlapCard>
                  ))}
                </CardRow>
              ))}
            </CardGridWrapper>
          </SentCardsSection>
        )}
        {tab === 'sent' && !isLoadingSent && !suggestionError && filteredSentMessages.length === 0 && (
          <SentCardsSection>
            <SentCardsTitle>내가 보낸 감정 카드</SentCardsTitle>
            <p>아직 작성한 카드가 없습니다.</p>
          </SentCardsSection>
        )}
        {tab === 'received' && !isLoadingReceived && !receivedError && Array.isArray(filteredReceivedMessages) && filteredReceivedMessages.length === 0 && (
          <SentCardsSection>
            <SentCardsTitle>내가 받은 감정 카드</SentCardsTitle>
            <p>아직 받은 카드가 없습니다.</p>
          </SentCardsSection>
        )}
        {tab === 'received' && !isLoadingReceived && filteredReceivedMessages.length > 0 && (
          <SentCardsSection>
            <SentCardsTitle>내가 받은 감정 카드</SentCardsTitle>
            <FilterContainer>
              <FilterGroup>
                <Select 
                  value={selectedMonth} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMonth(e.target.value)}
                >
                  {getAvailableMonths(filteredReceivedMessages).map(month => (
                    <option key={month} value={month}>
                      {month.replace('-', '년 ')}월
                    </option>
                  ))}
                </Select>
              </FilterGroup>
              <FilterGroup>
                <Select 
                  value={sortOrder} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                >
                  <option value="newest">최신순</option>
                  <option value="oldest">오래된순</option>
                </Select>
              </FilterGroup>
            </FilterContainer>
            <CardGridWrapper>
              {chunkCards<SentMessage>(filteredAndSortedReceivedMessages.slice(0, CARDS_PER_PAGE), CARDS_PER_ROW).map((row, rowIdx) => (
                <CardRow key={rowIdx}>
                  {(row as SentMessage[]).map((msg: SentMessage, idx: number, arr) => (
                    <OverlapCard
                      key={msg.id}
                      isHovered={false}
                      style={{ zIndex: arr.length - idx }}
                      onClick={() => openModal(msg)}
                    >
                      {isTodayKST(msg.createdAt) && <NewBadge>NEW</NewBadge>}
                      <CardEmoji>{msg.emoji || "❤️"}</CardEmoji>
                      <CardDate>{formatDateToKST(msg.createdAt)}</CardDate>
                    </OverlapCard>
                  ))}
                </CardRow>
              ))}
            </CardGridWrapper>
          </SentCardsSection>
        )}

      </PageContainer>

      {/* 카드 상세 모달: 이모지+내용 */}
      {selectedMessage && (
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
                  
                  fontSize: '1.1rem',
                  padding: '0.5rem 1rem 0rem',
                  
                  wordBreak: 'break-all',
                  lineHeight: 1.6,
                }}
              >
                {selectedMessage.text || selectedMessage.message || '-'}
              </div>
              <span style={{ color: '#888', fontSize: '0.95rem' }}>
                보낸 시간: {new Date(selectedMessage.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
              </span>
            </div>
          </ModalContent>
        </ModalBackground>
      )}

      <ConfirmationModal
        isOpen={isSubmitting}
        onRequestClose={() => setIsSubmitting(false)}
        onConfirm={() => { setIsSubmitting(false); handleSubmit(); }}
        title="감정카드 전송 안내"
        message={"감정카드는 한 번 보내면 수정이나 삭제가 불가능합니다. 정말로 보내시겠습니까?"}
        confirmButtonText="네, 보낼래요"
        cancelButtonText="취소"
      />

      <PartnerRequiredModal 
        open={showPartnerRequiredModal} 
        onClose={() => setShowPartnerRequiredModal(false)} 
      />

      <NavigationBar />
    </>
  );
};

// 토글로 보낸카드, 받은카드 리스트업 할수있게 하기. 
export default EmotionCard;