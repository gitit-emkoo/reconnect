import React, { useState } from 'react';
import styled from 'styled-components';
import { eventsApi } from '../../api/events';
import { toast } from 'react-toastify';

interface EventBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem 1.5rem 1.25rem;
  max-width: 420px;
  width: 100%;
  text-align: left;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 20px;
  line-height: 1;
  color: #999;
  cursor: pointer;
  padding: 4px;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 800;
  color: #333;
  margin: 0 0 1rem 0;
  text-align: center;
`;

const BannerImage = styled.img`
  width: 100%;
  border-radius: 12px;
  display: block;
`;

const Description = styled.div`
  margin-top: 12px;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const PrimaryButton = styled.button<{ $done?: boolean; $loading?: boolean }>`
  width: 100%;
  margin-top: 18px;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  background: ${props => props.$done ? '#e9ecef' : '#785CD2'};
  color: ${props => props.$done ? '#777' : '#fff'};
  font-weight: 700;
  font-size: 1rem;
  cursor: ${props => props.$done ? 'default' : 'pointer'};
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${props => props.$done ? '#e9ecef' : '#6B4FC7'};
  }

  &:disabled {
    background: #b8a8ff;
    cursor: default;
  }
`;

const InlineNotice = styled.div`
  margin-top: 8px;
  font-size: 0.85rem;
  color: #888;
  text-align: center;
  min-height: 1em;
`;

const EventBannerModal: React.FC<EventBannerModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [notice, setNotice] = useState('');

  const handleEnter = async () => {
    if (done) {
      toast.info('이미 응모하셨습니다.');
      setNotice('이미 응모했습니다.');
      setTimeout(() => setNotice(''), 2000);
      return;
    }
    try {
      setLoading(true);
      await eventsApi.enter();
      setDone(true);
      toast.success('응모가 완료되었습니다!');
      setNotice('응모가 완료되었습니다!');
    } catch (e) {
      alert('응모 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={() => !loading && onClose()}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton aria-label="닫기" onClick={() => !loading && onClose()}>✕</CloseButton>
        <Title>이벤트 안내</Title>
        <BannerImage src="/images/eventBanner.png" alt="이벤트 배너" />
        <Description>
          {!done ? (
            <>
              응모하기 버튼을 누르시면 본 이벤트에 즉시 참여됩니다.<br />
              당첨자 발표 및 혜택 지급은 공지에 따라 순차 진행됩니다.
            </>
          ) : (
            <span style={{ color: '#28a745', fontWeight: 700 }}>응모가 완료되었습니다!</span>
          )}
        </Description>
        <PrimaryButton onClick={handleEnter} disabled={loading} $done={done} aria-disabled={done} $loading={loading}>
          {done ? '응모완료' : (loading ? '응모 중...' : '응모하기')}
        </PrimaryButton>
        <InlineNotice>{notice}</InlineNotice>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EventBannerModal;


