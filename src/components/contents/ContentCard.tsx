import React from 'react';
import styled from 'styled-components';
import { ContentType } from '../../types/content';

interface ContentCardProps {
  title: string;
  type: ContentType;
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

const CardButton = styled.button`
  /* 버튼 기본 스타일 초기화 */
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  text-align: left;
  
  /* 기존 .content-card 스타일 */
  width: 180px;
  height: 220px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  margin: 8px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }

  /* 모바일 반응형 */
  @media (max-width: 768px) {
    width: 140px;
    height: 180px;
    margin: 4px;
  }
  
  /* 태블릿 반응형 */
  @media (min-width: 769px) and (max-width: 1024px) {
    width: 160px;
    height: 200px;
  }
`;

const Chip = styled.div`
  background: rgba(255, 255, 255, 0.5);
  color: #333;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 16px;
  font-weight: 600;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 4px 10px;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  padding: 0 16px;
  line-height: 1.4;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0,0,0,0.2);

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 0 8px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 16px;
  }
`;

export const ContentCard: React.FC<ContentCardProps> = ({ title, type, onClick, index }) => (
  <CardButton
    onClick={onClick}
    style={{
      background: CARD_COLORS[index % CARD_COLORS.length],
    }}
  >
    {/* <img src={thumbnail} alt={title} className="thumbnail" /> */}
    <Chip>{type}</Chip>
    <Title>{title}</Title>
  </CardButton>
);

// 스타일은 ContentCard.css를 참고하세요. 