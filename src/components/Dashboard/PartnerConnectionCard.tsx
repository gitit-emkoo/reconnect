import React from 'react';
import styled from 'styled-components';
import type { User } from '../../types/user';
import InviteCodeInputModal from '../Invite/InviteCodeInputModal';

// Styled Components (Dashboard.tsx에서 이동)
const PartnerCardContainer = styled.div`
  position: relative;
  border-radius: 1rem;
  width: 100%;
  min-height: 160px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  color: white;
  overflow: hidden;
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  width: 50%;

  @media (max-width: 768px) {
    width: 50%;
    flex: unset;
  }
`;

const PartnerInfo = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const PartnerImageArea = styled.div<{ imageUrl: string }>`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 65%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  mask-image: linear-gradient(to left, black 55%, transparent 85%);
  -webkit-mask-image: linear-gradient(to left, black 55%, transparent 85%);
`;

const PartnerCardTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  /* color는 props로 받아 동적으로 설정 */
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const PartnerDday = styled.div`
  font-size: 1rem;
  margin-bottom: 0.25rem;
  /* color는 props로 받아 동적으로 설정 */
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const PartnerTime = styled.div`
  font-size: 0.875rem;
  margin-bottom: 1rem;
  /* color는 props로 받아 동적으로 설정 */
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const InviteButton = styled.button`
  background-color: rgba(255, 255, 255, 0.9);
  color: #E64A8D;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: auto;
  align-self: flex-start;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }
`;

interface PartnerConnectionCardProps {
  user: User;
  partnerDisplayImageUrl: string | null;
  onOpenInviteModal: () => void;
}

const PartnerConnectionCard: React.FC<PartnerConnectionCardProps> = ({ 
  user, 
  partnerDisplayImageUrl, 
  onOpenInviteModal 
}) => {
  const cardBackgroundColor = user.partner ? '#FFC0CB' : '#A0D2DB';
  const titleColor = '#333';
  const nameColor = '#555';
  const timeColor = '#777';
  const [isCodeModalOpen, setIsCodeModalOpen] = React.useState(false);

  return (
    <PartnerCardContainer style={{ backgroundColor: cardBackgroundColor }}>
      <PartnerInfo>
        <div>
          <PartnerCardTitle style={{ color: titleColor }}>
            {user.partner ? `${user.partner.nickname}님과` : "파트너와 연결하기"}
          </PartnerCardTitle>
          {user.partner ? (
            <>
              <PartnerDday style={{ color: nameColor }}>함께한 지 D+100</PartnerDday> {/* 동적 데이터 필요 */}
              <PartnerTime style={{ color: timeColor }}>마지막 연결: 1시간 전</PartnerTime> {/* 동적 데이터 필요 */}
            </>
          ) : (
            <PartnerDday style={{ color: nameColor, marginBottom: '0.75rem', lineHeight: '1.4' }}>
              연결 코드를 공유하고<br/>서로의 활동을 확인해보세요!
            </PartnerDday>
          )}
        </div>
        {!user.partner && (
          <>
            <InviteButton onClick={onOpenInviteModal}>파트너 초대하기</InviteButton>
            <InviteButton style={{ marginTop: 8, background: '#f8f8f8', color: '#4169E1' }} onClick={() => setIsCodeModalOpen(true)}>
              초대코드 받으셨나요?
            </InviteButton>
          </>
        )}
      </PartnerInfo>
      {partnerDisplayImageUrl && <PartnerImageArea imageUrl={partnerDisplayImageUrl} />}
      {isCodeModalOpen && <InviteCodeInputModal onClose={() => setIsCodeModalOpen(false)} />}
    </PartnerCardContainer>
  );
};

export default PartnerConnectionCard; 