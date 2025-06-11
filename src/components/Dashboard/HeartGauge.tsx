import React from 'react';

interface HeartGaugeProps {
  percentage: number;
  size?: number;
}

const getHeartColor = (percentage: number) => {
  if (percentage <= 30) return '#FFD600'; // 노란색
  if (percentage <= 60) return '#FF9800'; // 주황색
  return '#FF4B4B'; // 빨간색
};

const HeartGauge: React.FC<HeartGaugeProps> = ({ percentage, size = 100 }) => {
  const radius = 45;
  const stroke = 8;
  const normalizedPercent = Math.max(0, Math.min(percentage, 100));
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - normalizedPercent / 100);

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* 배경 원 */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="#fff"
        strokeWidth={stroke}
        fill="none"
      />
      {/* 게이지 원 */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke={getHeartColor(percentage)}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      {/* 하트 아이콘 */}
      <text x="50" y="54" textAnchor="middle" fontSize="32" fill={getHeartColor(percentage)} dominantBaseline="middle">
        ♥
      </text>
      {/* 퍼센트 */}
      <text x="50" y="80" textAnchor="middle" fontSize="18" fill="#333" fontWeight="bold">
        {percentage}%
      </text>
    </svg>
  );
};

export default HeartGauge; 