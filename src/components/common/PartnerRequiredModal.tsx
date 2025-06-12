import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface PartnerRequiredModalProps {
  open: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const Description = styled.p`
  margin: 1rem 0 1.5rem;
  color: #666;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.$primary ? `
    background-color: #E64A8D;
    color: white;
    border: none;
    &:hover {
      background-color: #c33764;
    }
  ` : `
    background-color: white;
    color: #666;
    border: 1px solid #ddd;
    &:hover {
      background-color: #f5f5f5;
    }
  `}
`;

const PartnerRequiredModal: React.FC<PartnerRequiredModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handlePartnerConnect = () => {
    navigate('/partner/connect');
    onClose();
  };

  return (
    <ModalOverlay $isOpen={open} onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>파트너 연결 필요</Title>
        <Description>
          파트너와 연결이 필요한 메뉴입니다.
          파트너와 연결 후 재시도 바랍니다.
        </Description>
        <ButtonContainer>
          <Button onClick={onClose}>닫기</Button>
          <Button $primary onClick={handlePartnerConnect}>
            파트너 연결하기
          </Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PartnerRequiredModal; 