import React from 'react';

interface HeartGaugeProps {
  percentage: number;
  size?: number;
}

const HeartGauge: React.FC<HeartGaugeProps> = ({ percentage, size = 120 }) => {
  // 게이지 설정
  const percent = Math.max(0, Math.min(percentage, 100));
  const r = 60;
  const cx = 70;
  const cy = 70;
  const stroke = 16;
  const arcAngle = 220; // 220도
  const startAngle = 160; // 좌측 아래
  const endAngle = 380; // 우측 아래 (220도)
  const angle = (arcAngle * percent) / 100;

  // 각도를 라디안으로 변환
  const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
    const rad = (Math.PI / 180) * deg;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  // 게이지 채워진 부분 path
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, startAngle + angle);
  const largeArcFlag = angle > 180 ? 1 : 0;
  const d = [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 1, end.x, end.y
  ].join(' ');

  // 전체 배경 path (220도)
  const bgEnd = polarToCartesian(cx, cy, r, endAngle);
  const bgD = [
    'M', start.x, start.y,
    'A', r, r, 0, 1, 1, bgEnd.x, bgEnd.y
  ].join(' ');

  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 140 100">
      <defs>
        <linearGradient id="gauge-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffe066" />
          <stop offset="50%" stopColor="#ffa94d" />
          <stop offset="100%" stopColor="#ff6b6b" />
        </linearGradient>
      </defs>
      {/* 배경 아치 */}
      <path
        d={bgD}
        fill="none"
        stroke="#eee"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {/* 게이지 아치 */}
      <path
        d={d}
        fill="none"
        stroke="url(#gauge-gradient)"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {/* 중앙 온도 텍스트 */}
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="28" fill="#333" fontWeight="bold">
        {percent}°C
      </text>
    </svg>
  );
};

export default HeartGauge; 