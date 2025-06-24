import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div<{ $fullscreen?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => props.$fullscreen && `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255,255,255,0.5);
    z-index: 9999;
  `}
`;

const Spinner = styled.div<{ size: number }>`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f59e0b;
  border-radius: 50%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  animation: ${spin} 1s linear infinite;
`;

const LoadingSpinner: React.FC<{ size?: number; fullscreen?: boolean }> = ({ size = 40, fullscreen = true }) => (
  <SpinnerWrapper $fullscreen={fullscreen}>
    <Spinner size={size} />
  </SpinnerWrapper>
);

export default LoadingSpinner; 