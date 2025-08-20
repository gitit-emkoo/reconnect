import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getNotificationPreferences, updateNotificationPreferences } from '../../api/notification';

interface Props {
  open: boolean;
  onClose: () => void;
}

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.45);
  z-index: 10000;
  display: ${props => props.$open ? 'block' : 'none'};
`;

const Sheet = styled.div<{ $open: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -6px 24px rgba(0,0,0,0.12);
  max-height: 78vh;
  height: auto;
  transform: translateY(${props => props.$open ? '0%' : '100%'});
  transition: transform 180ms ease;
  padding-bottom: var(--safe-area-inset-bottom);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 8px 16px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
`;

const CloseBtn = styled.button`
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
`;

const Body = styled.div`
  padding: 8px 16px 16px 16px;
  overflow-y: auto;
  max-height: calc(78vh - 56px);
`;

const Row = styled.label<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 4px;
  border-bottom: 1px solid #f1f1f1;
  color: ${p => p.disabled ? '#bbb' : '#444'};
  pointer-events: ${p => p.disabled ? 'none' : 'auto'};
  &:last-child { border-bottom: none; }
`;

const Desc = styled.div`
  font-size: 0.95rem;
`;

const Toggle = styled.input.attrs({ type: 'checkbox' })``;

// Skeleton styles
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f2f2f2 25%, #e9e9e9 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 4px;
  border-bottom: 1px solid #f1f1f1;
  &:last-child { border-bottom: none; }
`;

const SkeletonText = styled(SkeletonBase)`
  width: 160px;
  height: 14px;
  border-radius: 6px;
`;

const SkeletonToggle = styled(SkeletonBase)`
  width: 40px;
  height: 24px;
  border-radius: 12px;
`;

const Footer = styled.div`
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 12px 16px;
  border-top: 1px solid #f1f1f1;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const PrimaryBtn = styled.button`
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(to right, #FF69B4, #4169E1);
`;

const SecondaryBtn = styled.button`
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 10px 16px;
  color: #555;
  background: #fff;
  cursor: pointer;
`;

export const NotificationSettingsSheet: React.FC<Props> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [muteAll, setMuteAll] = useState(false);
  const [muteCommunity, setMuteCommunity] = useState(false);
  const [muteChallenge, setMuteChallenge] = useState(false);
  const [muteEmotionCard, setMuteEmotionCard] = useState(false);

  const debounceRef = useRef<number | null>(null);
  const pendingRef = useRef({ muteAll: false, muteCommunity: false, muteChallenge: false, muteEmotionCard: false });

  // 초기 로드
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const prefs = await getNotificationPreferences();
        setMuteAll(!!prefs.muteAll);
        setMuteCommunity(!!prefs.muteCommunity);
        setMuteChallenge(!!prefs.muteChallenge);
        setMuteEmotionCard(!!prefs.muteEmotionCard);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    if (open) load();
  }, [open]);

  // 자동 저장(디바운스)
  const scheduleSave = () => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    pendingRef.current = { muteAll, muteCommunity, muteChallenge, muteEmotionCard };
    debounceRef.current = window.setTimeout(async () => {
      try {
        await updateNotificationPreferences(pendingRef.current);
      } catch {
        // 실패 시 무시(간단 처리). 필요하면 롤백/토스트 추가 가능
      }
    }, 300);
  };

  const handleAll = (checked: boolean) => {
    setMuteAll(checked);
    setMuteCommunity(checked ? true : muteCommunity);
    setMuteChallenge(checked ? true : muteChallenge);
    setMuteEmotionCard(checked ? true : muteEmotionCard);
    scheduleSave();
  };

  const close = () => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    onClose();
  };

  return (
    <Overlay $open={open} onClick={close}>
      <Sheet $open={open} onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>알림 설정</Title>
          <CloseBtn onClick={close}>✕</CloseBtn>
        </Header>
        <Body>
          {loading ? (
            <>
              {[0,1,2,3].map((i) => (
                <SkeletonRow key={i}>
                  <SkeletonText />
                  <SkeletonToggle />
                </SkeletonRow>
              ))}
            </>
          ) : (
            <>
              <Row>
                <Desc>전체 알림 끄기</Desc>
                <Toggle checked={muteAll} onChange={(e) => handleAll(e.target.checked)} />
              </Row>
              <Row disabled={muteAll}>
                <Desc>커뮤니티 알림 끄기</Desc>
                <Toggle checked={muteCommunity} onChange={(e) => { setMuteCommunity(e.target.checked); scheduleSave(); }} />
              </Row>
              <Row disabled={muteAll}>
                <Desc>챌린지 알림 끄기</Desc>
                <Toggle checked={muteChallenge} onChange={(e) => { setMuteChallenge(e.target.checked); scheduleSave(); }} />
              </Row>
              <Row disabled={muteAll}>
                <Desc>감정카드 알림 끄기</Desc>
                <Toggle checked={muteEmotionCard} onChange={(e) => { setMuteEmotionCard(e.target.checked); scheduleSave(); }} />
              </Row>
            </>
          )}
        </Body>
        <Footer>
          <SecondaryBtn onClick={close}>닫기</SecondaryBtn>
          <PrimaryBtn onClick={close}>확인</PrimaryBtn>
        </Footer>
      </Sheet>
    </Overlay>
  );
};

export default NotificationSettingsSheet;


