// src/pages/EmotionCard.tsx (백엔드 연동 수정)
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import ConfirmationModal from '../components/common/ConfirmationModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import useAuthStore from '../store/authStore';
import axiosInstance from '../api/axios';
import { User } from "../types/user";
import PartnerRequiredModal from '../components/common/PartnerRequiredModal';
import Popup from '../components/common/Popup';
import { formatInKST } from '../utils/date';
// import { useNotificationStore } from '../store/notificationsStore';
// import { useEmotionCardNotifications } from '../hooks/useEmotionCardNotifications';
import EmotionCardHeader from "../components/emotioncard/EmotionCardHeader";
import EmotionCardForm from "../components/emotioncard/EmotionCardForm";
import EmotionCardList from "../components/emotioncard/EmotionCardList";
import EmotionCardDetailModal from "../components/emotioncard/EmotionCardDetailModal";
import axios from 'axios';
import { userService } from '../services/userService';

// SentMessage 타입 정의 (백엔드 응답 기준)
export interface SentMessage {
  id: string; // 서버에서 생성된 ID (문자열로 가정)
  text: string;
  createdAt: string | Date; // 서버에서 내려오는 타임스탬프 (ISO 문자열로 가정)
  emoji?: string; // 이모지(선택)
  isRead?: boolean; // 읽음 여부(선택)
  message?: string; // 백엔드 호환(선택)
  senderId: string;
  receiverId: string;
  coupleId: string;
}

const Container = styled.div`
  
  background-color: #f0f4f8; /* 부드러운 배경색 */
  padding: 2rem 2rem 4rem 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center; 
  box-sizing: border-box; 
  overflow-y: auto; 
`;

const ErrorMessage = styled.p`
  color: #ef4444; 
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ContentWrapper = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 600px;
  margin-top: 1rem; /* PageHeaderContainer와의 추가 간격 (선택 사항) */
`;

// (fetchSentMessages, fetchReceivedMessages 함수 수정)
export async function fetchSentMessages(): Promise<SentMessage[]> {
  const { data } = await axiosInstance.get("/emotion-cards");
  return data;
}

export async function fetchReceivedMessages(): Promise<SentMessage[]> {
  const { data } = await axiosInstance.get("/emotion-cards/received");
  return data;
}

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
  const todayKey = 'emotioncard_popup';
  const today = new Date();
  const ymd = formatInKST(today, 'yyyyMMdd');
  const hideToday = typeof window !== 'undefined' && localStorage.getItem(`${todayKey}_${ymd}`) === 'true';
  const [showPopup, setShowPopup] = useState(!hideToday);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [tab, setTab] = useState<'sent' | 'received'>('sent');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // 보낸 메시지 쿼리 (파트너 없으면 비활성화)
  const {
    data: sentMessages = [],
    isLoading: isLoadingSent,
    error: sentError,
    refetch: refetchSent,
  } = useQuery<SentMessage[]>({
    queryKey: ['sentMessages', myId, partnerId],
    queryFn: async () => {
      if (!partnerId) return [];
      try {
        return await fetchSentMessages();
      } catch (error: any) {
        if (error?.response?.data?.code === 'PARTNER_REQUIRED') {
          setShowPartnerRequiredModal(true);
        }
        throw error;
      }
    },
    enabled: !!partnerId, // partnerId 없으면 아예 호출하지 않음
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
    enabled: !!myId && !!partnerId, // partnerId 없으면 아예 호출하지 않음
    refetchInterval: !!partnerId ? 10000 : false, // 10초마다로 조정 (실시간성과 성능의 균형)
  });

  // 커스텀 훅 사용 -> App.tsx로 이동
  // useEmotionCardNotifications(receivedMessages);

  // 탭 전환 시 refetch
  useEffect(() => {
    if (tab === 'received') {
      refetchReceived();
    } else if (tab === 'sent') {
      refetchSent();
    }
  }, [tab, refetchReceived, refetchSent]);
  
  const [selectedMessage, setSelectedMessage] = useState<SentMessage | null>(null);

  // === 필터링 추가 ===
  const filteredSentMessages = Array.isArray(sentMessages) ? sentMessages.filter(
    (msg: SentMessage) => msg.senderId === myId
  ) : [];
  
  const filteredReceivedMessages = Array.isArray(receivedMessages) ? receivedMessages.filter(
    (msg: SentMessage) => msg.senderId === partnerId && msg.receiverId === myId
  ) : [];

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
      const response = await axiosInstance.post('/emotion-cards/refine-text', {
        text: message
      });

      if (!response.data || !response.data.refinedText) {
        throw new Error('AI 제안을 가져오는데 실패했습니다.');
      }
      
      setSuggestion(response.data.refinedText);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setSuggestionError(err.response.data.message || "AI 제안 중 오류가 발생했습니다.");
      } else if (err instanceof Error) {
        setSuggestionError(err.message);
      } else {
        setSuggestionError("AI 제안 중 알 수 없는 오류 발생");
      }
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

  // 알림 처리 로직 추가 -> App.tsx로 이동하여 주석 처리
  /*
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
  */

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    // partnerId 또는 coupleId가 없으면 주기적으로 user 정보 fetch
    if (user && (!user.partner?.id || !user.couple?.id)) {
      interval = setInterval(async () => {
        try {
          const updatedUser = await userService.getMyProfile();
          useAuthStore.getState().setUser(updatedUser);
        } catch (e) { /* 무시 */ }
      }, 5000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [user]);

  if (sentError || receivedError) {
    return (
      <Container style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <EmotionCardHeader title="오류 발생" />
        <ErrorMessage>
          데이터를 불러오는 중 오류가 발생했습니다.
          {sentError?.message || receivedError?.message}
        </ErrorMessage>
      </Container>
    );
  }

  if (!partnerId) {
    return (
      <Container>
        <EmotionCardHeader title="오늘의 감정카드 작성" />
        <ContentWrapper>
          <ErrorMessage>파트너가 연결되어야 감정카드를 사용할 수 있습니다.</ErrorMessage>
        </ContentWrapper>
        <NavigationBar />
      </Container>
    );
  }

  return (
    <>
    <Popup
      isOpen={showPopup}
      onClose={() => setShowPopup(false)}
      title="감정카드, 진짜 효과가 있을까요?"
      emoji="💌"
      description={<>
        76%의 커플이 <b>관계가 이전보다 회복되었다</b>고 응답했어요.<br />
        오늘, 당신의 감정을 카드로 전해보세요!
      </>}
      buttonText="감정카드 작성 시작하기"
      onButtonClick={() => setShowPopup(false)}
      todayKey="emotioncard_popup"
    />
      <Container>
        <EmotionCardHeader title="오늘의 감정카드 작성" />
        
        <EmotionCardForm
            message={message}
            setMessage={setMessage}
            selectedEmoji={selectedEmoji}
            setSelectedEmoji={setSelectedEmoji}
            suggestion={suggestion}
            suggestionError={suggestionError}
            isSuggesting={isSuggesting}
            isSubmitting={sendCardMutation.isPending}
            onSuggest={handleSuggest}
            onApplySuggestion={applySuggestion}
            onSubmit={() => setIsSubmitting(true)}
        />
        
        <EmotionCardList 
            tab={tab}
            setTab={setTab}
            sentMessages={filteredSentMessages}
            receivedMessages={filteredReceivedMessages}
            isLoadingSent={isLoadingSent}
            isLoadingReceived={isLoadingReceived}
            openModal={openModal}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            hoveredCard={hoveredCard}
            setHoveredCard={setHoveredCard}
        />

      </Container>

      {selectedMessage && (
        <EmotionCardDetailModal 
            selectedMessage={selectedMessage}
            tab={tab}
            closeModal={closeModal}
        />
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
 
export default EmotionCard;