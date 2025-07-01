import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  100% {
    left: 100%;
  }
`;

const SkeletonBox = styled.div<{
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
}>
  `
  background: #eee;
  border-radius: ${props => props.borderRadius ?? 12}px;
  position: relative;
  overflow: hidden;
  width: ${props => typeof props.width === 'number' ? `${props.width}px` : props.width ?? '100%'};
  height: ${props => typeof props.height === 'number' ? `${props.height}px` : props.height ?? '20px'};

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 0; left: -60%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, #f5f5f5 60%, transparent);
    animation: ${shimmer} 1.2s infinite;
  }
`;

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, borderRadius, style, className }) => (
  <SkeletonBox width={width} height={height} borderRadius={borderRadius} style={style} className={className} />
);

export default Skeleton; 