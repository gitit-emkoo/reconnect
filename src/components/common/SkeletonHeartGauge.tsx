import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const ShimmerArcWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 96px;
`;

const ShimmerArc = styled.svg`
  position: absolute;
  top: 0; left: 0;
`;

const ShimmerOverlay = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  overflow: hidden;
`;

const ShimmerBar = styled.div`
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, #f5f5f5 60%, transparent);
  animation: ${shimmer} 1.2s infinite;
  position: absolute;
  top: 0; left: 0;
`;

const SkeletonHeartGauge: React.FC<{ size?: number }> = ({ size = 120 }) => {
  // HeartGauge와 동일한 반원(아크) SVG 구조
  const r = 60;
  const cx = 70;
  const cy = 70;
  const stroke = 16;
  const startAngle = 160;
  const endAngle = 380;

  // 반원 경로 계산
  const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
    const rad = (Math.PI / 180) * deg;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };
  const start = polarToCartesian(cx, cy, r, startAngle);
  const bgEnd = polarToCartesian(cx, cy, r, endAngle);
  const bgD = [
    'M', start.x, start.y,
    'A', r, r, 0, 1, 1, bgEnd.x, bgEnd.y
  ].join(' ');

  return (
    <ShimmerArcWrapper style={{ width: size, height: size * 0.8 }}>
      <ShimmerArc width={size} height={size * 0.8} viewBox="0 0 140 100">
        <path
          d={bgD}
          fill="none"
          stroke="#eee"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </ShimmerArc>
      <ShimmerOverlay>
        <ShimmerBar />
      </ShimmerOverlay>
    </ShimmerArcWrapper>
  );
};

export default SkeletonHeartGauge; 