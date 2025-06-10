import React from 'react';

interface HeartGaugeProps {
  percentage: number; // 0~100
  size?: number;
}

const HeartGauge: React.FC<HeartGaugeProps> = ({ percentage, size = 60 }) => {
  // 0~100 → 0~1
  const fillPercent = Math.max(0, Math.min(percentage, 100)) / 100;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* 회색 배경 하트 */}
      <path
        d="M50 91s-36-24.35-36-54A22 22 0 0 1 50 21a22 22 0 0 1 36 16c0 29.65-36 54-36 54z"
        fill="#eee"
      />
      {/* 빨간색 채워진 하트 (clipPath로 fillPercent만큼만 보이게) */}
      <clipPath id="heart-clip">
        <rect x="0" y={100 - 100 * fillPercent} width="100" height={100 * fillPercent} />
      </clipPath>
      <path
        d="M50 91s-36-24.35-36-54A22 22 0 0 1 50 21a22 22 0 0 1 36 16c0 29.65-36 54-36 54z"
        fill="#FF4B4B"
        clipPath="url(#heart-clip)"
      />
    </svg>
  );
};

export default HeartGauge; 