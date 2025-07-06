import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  children?: React.ReactNode;
}

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 320px;
  max-width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 25px;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const StyledButton = styled.button<{
  $primary?: boolean;
  $isConfirm?: boolean;
}>`
  padding: 10px 0;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  width: 120px;

  ${(props) =>
    props.$isConfirm
      ? `
    background: linear-gradient(to right, #FF69B4, #4169E1);
    color: white;
    &:hover {
      filter: brightness(0.95);
    }
  `
      : `
    background-color: #f0f0f0;
    color: #555;
    border-color: #ddd;
    &:hover {
      background-color: #e0e0e0;
      border-color: #ccc;
    }
  `}
`;

// App.tsx 또는 index.tsx에서 Modal.setAppElement('#root');를 호출하는 것이 좋습니다.
// 여기서는 임시로 body를 사용합니다. 이전 단계에서 #root로 수정하는 것을 잊었습니다.
if (typeof window !== 'undefined' && document.getElementById('root')) {
  Modal.setAppElement('#root');
} else if (typeof window !== 'undefined') {
    Modal.setAppElement('body'); 
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  title,
  message,
  confirmButtonText = '확인',
  cancelButtonText = '취소',
  showCancelButton = true,
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1050, // 다른 모달보다 위에 표시될 수 있도록 z-index 조정
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '0',
          transform: 'translate(-50%, -50%)',
          border: 'none',
          padding: '0',
          borderRadius: '8px',
          overflow: 'visible',
          background: 'transparent',
        },
      }}
      ariaHideApp={process.env.NODE_ENV !== 'test'}
    >
      <ModalContent>
        {title && <ModalTitle>{title}</ModalTitle>}
        {children ? children : <Message>{message}</Message>}
        <ButtonContainer>
          {showCancelButton && <StyledButton onClick={onRequestClose}>{cancelButtonText}</StyledButton>}
          <StyledButton onClick={onConfirm} $isConfirm $primary={confirmButtonText === '로그아웃' || title?.includes('삭제') || title?.includes('탈퇴') } >
            {confirmButtonText}
          </StyledButton>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal; 