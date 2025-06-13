import React from 'react';
import styled from 'styled-components';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const PopupBox = styled.div`
  background: #fff;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  min-width: 320px;
  max-width: 90vw;
  text-align: center;
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: #888;
  cursor: pointer;
`;

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <Backdrop onClick={onClose}>
      <PopupBox onClick={e => e.stopPropagation()}>
        <CloseBtn onClick={onClose}>&times;</CloseBtn>
        {children}
      </PopupBox>
    </Backdrop>
  );
};

export default Popup; 