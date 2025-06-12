import React from 'react';
import styled from 'styled-components';

interface ContentCardProps {
  title: string;
  chip: string;
  // thumbnail: string; // 이미지 대신 배경색 사용
  onClick?: () => void;
  index: number;
}

const CARD_COLORS = [
  '#FFB4A2', // 코랄
  '#B5EAD7', // 민트
  '#B5D0E0', // 하늘
  '#FFD6A5', // 오렌지
  '#E2F0CB', // 연두
  '#C7CEEA', // 연보라
  '#FFDAC1', // 살구
  '#E2C2B9', // 베이지
];

const Card = styled.div<{ bgColor: string }>`
  width: 90vw;
  max-width: 340px;
  height: 140px;
  border-radius: 16px;
  background: ${({ bgColor }) => bgColor};
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  margin: 12px auto;
  cursor: pointer;
  transition: transform 0.1s;
  &:active {
    transform: scale(0.97);
  }
`;

const Chip = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ff6fcb;
  color: #fff;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: bold;
  z-index: 2;
`;

const Title = styled.div`
  margin-top: 32px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  color: #333;
  word-break: keep-all;
`;

export const ContentCard: React.FC<ContentCardProps> = ({ title, chip, onClick, index }) => (
  <Card bgColor={CARD_COLORS[index % CARD_COLORS.length]} onClick={onClick}>
    <Chip>{chip}</Chip>
    <Title>{title}</Title>
  </Card>
);

// 스타일은 ContentCard.css를 참고하세요. 