import React from 'react';
import styled from 'styled-components';

interface ActionButtonProps {
  type: 'like' | 'download';
  onClick: () => void;
}

interface StyledButtonProps {
  buttonType: 'like' | 'download';
}

const ButtonContainer = styled.button<StyledButtonProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.buttonType === 'like' 
    ? 'rgba(255, 105, 180, 0.6)' 
    : 'rgba(65, 105, 225, 0.6)'};
  backdrop-filter: blur(4px);

  svg {
    fill: rgba(255, 255, 255, 0.9);
    transition: fill 0.2s;
  }

  &:hover {
    transform: scale(1.1);
    background: ${props => props.buttonType === 'like' 
      ? 'rgba(255, 105, 180, 0.8)' 
      : 'rgba(65, 105, 225, 0.8)'};

    svg {
      fill: rgba(255, 255, 255, 1);
    }
  }
`;

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
  </svg>
);

const ActionButton: React.FC<ActionButtonProps> = ({ type, onClick }) => {
  return (
    <ButtonContainer buttonType={type} onClick={onClick}>
      {type === 'like' ? <HeartIcon /> : <DownloadIcon />}
    </ButtonContainer>
  );
};

export default ActionButton; 