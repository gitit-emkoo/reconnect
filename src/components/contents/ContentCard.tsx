import React from 'react';
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

export const ContentCard: React.FC<ContentCardProps> = ({ title, type, onClick, index }) => (
  <div
    className="content-card"
    onClick={onClick}
    style={{
      background: CARD_COLORS[index % CARD_COLORS.length],
    }}
  >
    {/* <img src={thumbnail} alt={title} className="thumbnail" /> */}
    <div className="chip">{type}</div>
    <div className="title">{title}</div>
  </div>
);

// 스타일은 ContentCard.css를 참고하세요. 