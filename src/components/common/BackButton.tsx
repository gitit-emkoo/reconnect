import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Button = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }

  &:active {
    background: rgba(255, 255, 255, 0.9);
  }

  svg {
    width: 24px;
    height: 24px;
    fill: #333;
  }
`;

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  fallbackTo?: string; // 히스토리가 없을 때 이동할 경로
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, className, fallbackTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const hasHistory = window.history.length > 1;
      const sameOriginRef = document.referrer && document.referrer.startsWith(window.location.origin);
      if (hasHistory && sameOriginRef) {
        navigate(-1);
      } else if (fallbackTo) {
        navigate(fallbackTo);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <Button onClick={handleClick} className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    </Button>
  );
};

export default BackButton; 