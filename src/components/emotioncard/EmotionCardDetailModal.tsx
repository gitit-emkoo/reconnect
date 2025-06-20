import React from 'react';
import styled from 'styled-components';
import { SentMessage } from '../../pages/EmotionCard';
import { formatInKST } from '../../utils/date';

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; // NavigationBar보다 위에 오도록
`;

const ModalContent = styled.div`
  background-color:     #ffffff;
  padding: 1.5rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  position: relative;

  h4 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    white-space: pre-wrap; // 줄바꿈 유지
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4a5568;

  &:hover {
    color: #1a202c;
  }
`;

interface EmotionCardDetailModalProps {
    selectedMessage: SentMessage;
    tab: 'sent' | 'received';
    closeModal: () => void;
}

const EmotionCardDetailModal: React.FC<EmotionCardDetailModalProps> = ({ selectedMessage, tab, closeModal }) => {
    const formattedDate = selectedMessage
        ? formatInKST(selectedMessage.createdAt, 'yyyy년 M월 d일 a h:mm')
        : '';

    return (
        <ModalBackground onClick={closeModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={closeModal}>&times;</CloseButton>
                <h4>{tab === 'sent' ? '내가 보낸 감정 카드' : '내가 받은 감정 카드'}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{selectedMessage.emoji || '❤️'}</span>
                    <div
                        style={{
                            maxHeight: '180px',
                            overflowY: 'auto',
                            marginBottom: '0.5rem',
                            fontSize: '1.1rem',
                            padding: '0.5rem 1rem 0rem',
                            wordBreak: 'break-all',
                            lineHeight: 1.6,
                        }}
                    >
                        {selectedMessage.text || selectedMessage.message || '-'}
                    </div>
                    <span style={{ color: '#888', fontSize: '0.95rem' }}>
                        {tab === 'sent' ? '보낸 시간' : '받은 시간'}: {formattedDate}
                    </span>
                </div>
            </ModalContent>
        </ModalBackground>
    );
};

export default EmotionCardDetailModal; 