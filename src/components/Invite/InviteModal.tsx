import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { partnerInvitesApi, type PartnerInvite } from '../../api/partnerInvites';
import useAuthStore from '../../store/authStore';
import axiosInstance from '../../api/axios';
import type { AxiosError } from 'axios';

// 모달 스타일링

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative; // 닫기 버튼 위치 기준
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  &:hover {
    color: #333;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;


const ShareButton = styled.button<{ bg: string; textColor?: string }>`
  background: ${({ bg }) => bg}; // 그라데이션을 위해 background 사용
  color: ${({ textColor }) => textColor || 'white'}; // textColor prop 또는 기본 흰색
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 500; // 두께 추가
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.9;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const CodeContainer = styled.div`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Code = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #E64A8D;
  margin: 1rem 0;
  letter-spacing: 0.2rem;
`;

const CopyButton = styled.button`
  background-color: #E64A8D;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-bottom: 1rem;

  &:hover {
    background-color: #c33764;
  }
`;

const StatusMessage = styled.div`
  text-align: center;
  margin: 1rem 0;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  text-align: center;
  margin: 1rem 0;
`;

interface InviteModalProps {
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ onClose }) => {
  const [invite, setInvite] = useState<PartnerInvite | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInvite();
  }, []);

  const loadInvite = async () => {
    try {
      setIsLoading(true);
      // 콘솔: accessToken, useAuthStore 상태
      const token = useAuthStore.getState().token;
      console.log('[InviteModal] token:', token);
      console.log('[InviteModal] useAuthStore:', useAuthStore.getState());
      // 콘솔: axiosInstance Authorization 헤더
      console.log('[InviteModal] axiosInstance default headers:', axiosInstance.defaults.headers);
      const invites = await partnerInvitesApi.getMyInvites();
      const pendingInvite = invites.find(inv => inv.status === 'PENDING');
      if (pendingInvite) {
        setInvite(pendingInvite);
      } else {
        // 새로운 초대 코드 생성
        const newInvite = await partnerInvitesApi.createInviteCode();
        setInvite(newInvite);
      }
    } catch (err) {
      let errorMsg = '초대 코드를 불러오는데 실패했습니다.';
      if (typeof err === 'string') {
        errorMsg = err;
      } else if (
        (err as AxiosError<{ message?: string }>).isAxiosError &&
        (err as AxiosError<{ message?: string }>).response?.data?.message
      ) {
        errorMsg = (err as AxiosError<{ message?: string }>).response!.data!.message!;
      }
      setError(errorMsg);
      console.error('Failed to load invite:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!invite) return;
    try {
      await navigator.clipboard.writeText(invite.code);
      alert('초대 코드가 복사되었습니다!');
    } catch (err) {
      setError('초대 코드 복사에 실패했습니다.');
      console.error('Failed to copy code:', err);
    }
  };

  const handleShare = async () => {
    if (!invite) return;
    const message = `리커넥트에서 파트너와 연결해보세요!\n초대 코드: ${invite.code}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '리커넥트 파트너 초대',
          text: message,
        });
      } catch (err) {
        console.error('Failed to share:', err);
        // 공유 API가 실패하면 클립보드에 복사
        await navigator.clipboard.writeText(message);
        alert('초대 메시지가 클립보드에 복사되었습니다!');
      }
    } else {
      // 공유 API를 지원하지 않는 경우 클립보드에 복사
      await navigator.clipboard.writeText(message);
      alert('초대 메시지가 클립보드에 복사되었습니다!');
    }
  };

  if (isLoading) {
    return (
      <ModalBackdrop>
        <ModalContent>
          <StatusMessage>초대 코드를 생성하는 중...</StatusMessage>
        </ModalContent>
      </ModalBackdrop>
    );
  }

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>파트너 초대하기</Title>
        
        {error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : invite ? (
          <>
            <CodeContainer>
              <div>초대 코드</div>
              <Code>{invite.code}</Code>
            </CodeContainer>
            
            <CopyButton onClick={handleCopyCode}>
              초대 코드 복사하기
            </CopyButton>
            
            <ShareButton onClick={handleShare}bg='#FEE500'>
              카카오톡으로 공유하기
            </ShareButton>

            <StatusMessage>
              {invite.status === 'PENDING' && '파트너가 초대 코드를 입력할 때까지 기다려주세요.'}
              {invite.status === 'RESPONDED' && '파트너가 초대에 응답했습니다. 수락하시겠습니까?'}
              {invite.status === 'CONFIRMED' && '파트너와 연결이 완료되었습니다!'}
              {invite.status === 'REJECTED' && '파트너가 초대를 거절했습니다.'}
              {invite.status === 'EXPIRED' && '초대가 만료되었습니다.'}
            </StatusMessage>
          </>
        ) : (
          <ErrorMessage>초대 코드를 생성할 수 없습니다.</ErrorMessage>
        )}
      </ModalContent>
    </ModalBackdrop>
  );
}; 