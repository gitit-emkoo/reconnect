import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: #ffe6f0;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  text-align: center;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 1rem;
  border-radius: 2rem;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  background: #c084fc;
  color: #fff;
  cursor: pointer;
  &:last-child {
    background: #fff;
    color: #c084fc;
    border: 2px solid #c084fc;
  }
`;

interface PartnerConnectCardProps {
  onShareClick: () => void;
  onInputClick: () => void;
}

const PartnerConnectCard: React.FC<PartnerConnectCardProps> = ({ onShareClick, onInputClick }) => (
  <Card>
    <div style={{ fontWeight: 600, marginBottom: '1rem' }}>
      우리, 더 가까워지려면 연결해볼까요?
    </div>
    <Button onClick={onShareClick}>코드 공유하기</Button>
    <Button onClick={onInputClick}>초대코드 입력하기</Button>
  </Card>
);

export default PartnerConnectCard; 