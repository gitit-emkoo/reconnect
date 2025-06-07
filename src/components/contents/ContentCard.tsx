import React from 'react';

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

export const ContentCard: React.FC<ContentCardProps> = ({ title, chip, onClick, index }) => (
  <div
    className="content-card"
    onClick={onClick}
    style={{
      cursor: 'pointer',
      background: CARD_COLORS[index % CARD_COLORS.length],
      minHeight: 180,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      margin: 8,
    }}
  >
    {/* <img src={thumbnail} alt={title} className="thumbnail" /> */}
    <div className="chip" style={{ marginBottom: 12, fontWeight: 600 }}>{chip}</div>
    <div className="title" style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
  </div>
);

// 스타일은 ContentCard.css를 참고하세요. 