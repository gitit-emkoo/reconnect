import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1rem 0;
`;

const Message = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 2rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;

  ${props => props.$variant === 'primary' ? `
    background: #785CD2;
    color: white;
    
    &:hover {
      background: #6B4FC7;
    }
  ` : `
    background: #f8f9fa;
    color: #666;
    border: 1px solid #e9ecef;
    
    &:hover {
      background: #e9ecef;
    }
  `}
`;

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  // 이미 로그인된 경우 성공 콜백 실행
  React.useEffect(() => {
    if (isOpen && isAuthenticated && onSuccess) {
      onSuccess();
    }
  }, [isOpen, isAuthenticated, onSuccess]);

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>로그인이 필요합니다</Title>
        <Message>
          이 기능을 사용하려면 로그인이 필요합니다.<br />
          계정이 없으시다면 회원가입을 해주세요.
        </Message>
        <ButtonGroup>
          <Button $variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button $variant="primary" onClick={handleLogin}>
            로그인
          </Button>
          <Button $variant="secondary" onClick={handleRegister}>
            회원가입
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal; 