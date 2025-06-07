import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div<{ size?: number }>`
  width: ${({ size = 40 }) => size}px;
  height: ${({ size = 40 }) => size}px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #FF69B4 0%,
    #8A2BE2 100%
  );
  mask: 
    radial-gradient(farthest-side, transparent calc(100% - ${({ size = 40 }) => size / 8}px), #000 calc(100% - ${({ size = 40 }) => size / 8}px));
  -webkit-mask: 
    radial-gradient(farthest-side, transparent calc(100% - ${({ size = 40 }) => size / 8}px), #000 calc(100% - ${({ size = 40 }) => size / 8}px));
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 120px;
`;

const LoadingSpinner: React.FC<{ size?: number }>= ({ size = 40 }) => (
  <SpinnerWrapper>
    <Spinner size={size} />
  </SpinnerWrapper>
);

export default LoadingSpinner; 