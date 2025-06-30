import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: #f5f5f7;
  border-radius: 1rem;
  padding: 1.1rem 1rem;
  text-align: center;
  margin-top: 1rem;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  margin: 0.4rem 0;
  padding: 0.7rem 0;
  border-radius: 1.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  background: #785cd2;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:last-child {
    background: #fff;
    color: #785cd2;
    border: 2px solid #9f82fe;
  }
`;

interface PartnerConnectCardProps {
  onShareClick: () => void;
  onInputClick: () => void;
}

const PartnerConnectCard: React.FC<PartnerConnectCardProps> = ({ onShareClick, onInputClick }) => (
  <Card>
    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.7rem' }}>
      우리, 더 가까워지려면 연결해볼까요?
    </div>
    <Button onClick={onShareClick}>코드 공유하기</Button>
    <Button onClick={onInputClick}>초대코드 입력하기</Button>
  </Card>
);

export default PartnerConnectCard; 