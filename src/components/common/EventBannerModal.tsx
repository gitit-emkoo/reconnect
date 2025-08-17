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

const DetailsBox = styled.div`
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  background: #fafafa;
  border: 1px solid #eee;
  color: #555;
  font-size: 0.92rem;
  line-height: 1.5;

  ul { margin: 6px 0 0 18px; }
  li { margin: 4px 0; }
`;

const MoreToggle = styled.button`
  margin-top: 8px;
  border: none;
  background: transparent;
  color: #785CD2;
  font-weight: 700;
  cursor: pointer;
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
  const [expanded, setExpanded] = useState(false);

  // 모달이 열릴 때 이미 응모했는지 확인
  React.useEffect(() => {
    let mounted = true;
    const check = async () => {
      if (!isOpen) return;
      try {
        const res = await eventsApi.getMyEntry();
        if (!mounted) return;
        if (res?.entry) {
          setDone(true);
          setNotice('응모가 완료되었습니다!');
        } else {
          setDone(false);
          setNotice('');
        }
      } catch {
        // 무시 (비로그인 등)
      }
    };
    check();
    return () => { mounted = false; };
  }, [isOpen]);

  const handleEnter = async () => {
    if (loading) return; // 중복 클릭 가드
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
      toast.error('응모 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
          응모하기 버튼을 누르시면 본 이벤트에 즉시 참여됩니다.<br />
          당첨자 발표 및 혜택 지급은 공지에 따라 순차 진행됩니다.
        </Description>
        <DetailsBox>
          <div style={{ fontWeight: 700, color: '#333', marginBottom: 6 }}>이벤트 내용</div>
          <ul>
            <li>이벤트명: 론칭 기념 클릭 경품 이벤트</li>
            <li>응모 방법: 본 모달에서 ‘응모하기’ 클릭 시 자동 응모</li>
            <li>응모 대상: 리커넥트 회원 1인 1회</li>
          </ul>
          {expanded && (
            <ul>
              <li>경품: 텀블러 50명, 신세계 상품권 2만원 20명, 스타벅스 아메리카노 100명</li>
              <li>발표: 앱 공지 및 개별 연락</li>
              <li>유의사항: 부정 참여로 판단될 경우 당첨이 취소될 수 있습니다.</li>
            </ul>
          )}
          <MoreToggle onClick={() => setExpanded(v => !v)}>
            {expanded ? '접기 ▴' : '자세히 보기 ▾'}
          </MoreToggle>
        </DetailsBox>
        <PrimaryButton onClick={handleEnter} disabled={loading} $done={done} aria-disabled={done} $loading={loading}>
          {done ? '응모완료' : (loading ? '응모 중...' : '응모하기')}
        </PrimaryButton>
        <InlineNotice>{notice}</InlineNotice>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EventBannerModal;


