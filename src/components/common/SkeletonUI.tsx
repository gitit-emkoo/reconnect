import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonBase = styled.div<{ width?: string; height?: string; borderRadius?: string }>`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
  border-radius: ${props => props.borderRadius || '4px'};
`;

const SkeletonCircle = styled(SkeletonBase)`
  border-radius: 50%;
`;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const SkeletonContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

interface DiarySkeletonProps {
  size?: number;
}

const DiarySkeleton: React.FC<DiarySkeletonProps> = ({ size = 100 }) => {
  return (
    <SkeletonContainer>
      {/* 감정 이미지 스켈레톤 */}
      <SkeletonCircle width={`${size}px`} height={`${size}px`} />
      
      {/* 내용 스켈레톤 */}
      <SkeletonContent>
        <SkeletonRow>
          <SkeletonBase width="60px" height="16px" />
          <SkeletonBase width="80px" height="16px" />
        </SkeletonRow>
        
        <SkeletonRow>
          <SkeletonBase width="60px" height="16px" />
          <SkeletonBase width="120px" height="16px" />
        </SkeletonRow>
        
        <SkeletonRow>
          <SkeletonBase width="80px" height="16px" />
          <SkeletonBase width="60px" height="16px" />
        </SkeletonRow>
        
        <SkeletonRow>
          <SkeletonBase width="60px" height="16px" />
          <SkeletonBase width="100px" height="16px" />
        </SkeletonRow>
      </SkeletonContent>
    </SkeletonContainer>
  );
};

export default DiarySkeleton; 