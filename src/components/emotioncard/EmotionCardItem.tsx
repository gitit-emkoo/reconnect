import React from 'react';
import styled from 'styled-components';
import { SentMessage } from '../../pages/EmotionCard';
import { formatInKST, isTodayKST } from '../../utils/date';

const OverlapCard = styled.div<{ isHovered: boolean, zIndex: number }>`
  width: 70px;
  height: 100px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.10);
  margin-left: -22px;
  z-index: ${({ isHovered, zIndex }) => (isHovered ? 100 : zIndex)};
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

const NewBadge = styled.span`
  display: inline-block;
  background: #ef4444;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 2px 7px;
  margin-left: 6px;
  vertical-align: middle;
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 0.5rem;
  padding: 2px 4px;
`;

interface EmotionCardItemProps {
  card: SentMessage;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  showTodayBadge: boolean;
  zIndex: number;
}

const EmotionCardItem: React.FC<EmotionCardItemProps> = ({ card, isHovered, onMouseEnter, onMouseLeave, onClick, showTodayBadge, zIndex }) => {
  return (
    <OverlapCard
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      isHovered={isHovered}
      zIndex={zIndex}
    >
      {showTodayBadge && isTodayKST(card.createdAt) && (
        <NewBadge>TODAY</NewBadge>
      )}
      <CardEmoji>{card.emoji}</CardEmoji>
      <CardDate>
        {formatInKST(card.createdAt, 'MM.dd')}
      </CardDate>
    </OverlapCard>
  );
};

export default EmotionCardItem; 