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

export const PostListSkeleton = () => (
  <div style={{ padding: '0 0.5rem' }}>
    {Array.from({ length: 10 }).map((_, idx) => (
      <div key={idx} style={{ padding: '1.2rem 0', borderBottom: '1px solid #f1f3f5' }}>
        <Skeleton width={80} height={18} style={{ marginBottom: 8 }} /> {/* 카테고리 */}
        <Skeleton width="100%" height={22} style={{ marginBottom: 8 }} /> {/* 제목 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <Skeleton width={60} height={16} />
          <Skeleton width={60} height={16} />
          <Skeleton width={60} height={16} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Skeleton width={40} height={14} />
          <Skeleton width={40} height={14} />
          <Skeleton width={60} height={14} />
          <Skeleton width={60} height={14} />
        </div>
      </div>
    ))}
  </div>
);

export const PostDetailSkeleton = () => (
  <div style={{ padding: '1rem' }}>
    {/* 제목 */}
    <Skeleton width="100%" height={28} style={{ marginBottom: '1rem' }} />
    
    {/* 작성자 정보 */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
      <Skeleton width={40} height={40} borderRadius="50%" />
      <div>
        <Skeleton width={80} height={16} style={{ marginBottom: '0.25rem' }} />
        <Skeleton width={120} height={14} />
      </div>
    </div>
    
    {/* 카테고리 및 태그 */}
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <Skeleton width={60} height={20} borderRadius="10px" />
      <Skeleton width={60} height={20} borderRadius="10px" />
      <Skeleton width={60} height={20} borderRadius="10px" />
    </div>
    
    {/* 본문 내용 */}
    <div style={{ marginBottom: '2rem' }}>
      <Skeleton width="100%" height={16} style={{ marginBottom: '0.5rem' }} />
      <Skeleton width="90%" height={16} style={{ marginBottom: '0.5rem' }} />
      <Skeleton width="95%" height={16} style={{ marginBottom: '0.5rem' }} />
      <Skeleton width="85%" height={16} style={{ marginBottom: '0.5rem' }} />
      <Skeleton width="100%" height={16} style={{ marginBottom: '0.5rem' }} />
      <Skeleton width="70%" height={16} />
    </div>
    
    {/* 댓글 섹션 */}
    <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: '1rem' }}>
      <Skeleton width={80} height={20} style={{ marginBottom: '1rem' }} />
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} style={{ marginBottom: '1rem', padding: '0.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Skeleton width={32} height={32} borderRadius="50%" />
            <Skeleton width={60} height={14} />
            <Skeleton width={80} height={14} />
          </div>
          <Skeleton width="100%" height={16} style={{ marginBottom: '0.25rem' }} />
          <Skeleton width="70%" height={16} />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton; 
