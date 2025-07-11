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

// 커뮤니티 포스트 리스트 스켈레톤
const PostListSkeletonContainer = styled.div`
  background-color: white;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const PostListSkeletonItem = styled.div`
  padding: 1rem 1.2rem;
  border-bottom: 1px solid #f1f3f5;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const PostListSkeleton: React.FC = () => (
  <PostListSkeletonContainer>
    {Array.from({ length: 5 }).map((_, index) => (
      <PostListSkeletonItem key={index}>
        <Skeleton width={60} height={20} borderRadius={12} style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="90%" height={16} style={{ marginBottom: '0.4rem' }} />
        <Skeleton width="70%" height={16} style={{ marginBottom: '0.7rem' }} />
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Skeleton width={40} height={16} borderRadius={8} />
          <Skeleton width={50} height={16} borderRadius={8} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Skeleton width={60} height={12} />
          <Skeleton width={80} height={12} />
          <Skeleton width={50} height={12} />
        </div>
      </PostListSkeletonItem>
    ))}
  </PostListSkeletonContainer>
);

// 포스트 상세 스켈레톤
const PostDetailSkeletonContainer = styled.div`
  background-color: white;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 2rem;
  margin-bottom: 1rem;
`;

export const PostDetailSkeleton: React.FC = () => (
  <PostDetailSkeletonContainer>
    <div style={{ marginBottom: '1rem' }}>
      <Skeleton width={80} height={24} borderRadius={12} style={{ marginBottom: '0.5rem' }} />
      <Skeleton width="100%" height={32} style={{ marginBottom: '1rem' }} />
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Skeleton width={60} height={14} />
        <Skeleton width={80} height={14} />
        <Skeleton width={50} height={14} />
      </div>
    </div>
    
    <div style={{ marginBottom: '2rem' }}>
      <Skeleton width="100%" height={20} style={{ marginBottom: '0.8rem' }} />
      <Skeleton width="95%" height={20} style={{ marginBottom: '0.8rem' }} />
      <Skeleton width="80%" height={20} style={{ marginBottom: '0.8rem' }} />
      <Skeleton width="90%" height={20} style={{ marginBottom: '0.8rem' }} />
      <Skeleton width="70%" height={20} />
    </div>
    
    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
      <Skeleton width={50} height={20} borderRadius={10} />
      <Skeleton width={60} height={20} borderRadius={10} />
    </div>
    
    <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: '1rem' }}>
      <Skeleton width={100} height={20} style={{ marginBottom: '1rem' }} />
      <div style={{ marginBottom: '1rem' }}>
        <Skeleton width={80} height={16} style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="100%" height={16} style={{ marginBottom: '0.3rem' }} />
        <Skeleton width="85%" height={16} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <Skeleton width={90} height={16} style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="100%" height={16} style={{ marginBottom: '0.3rem' }} />
        <Skeleton width="75%" height={16} />
      </div>
    </div>
  </PostDetailSkeletonContainer>
);

export default Skeleton; 