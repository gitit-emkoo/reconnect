
import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: #fff;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  text-align: center;
  margin-top: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

interface PartnerCardProps {
  partner: {
    id: string;
    nickname: string;
    email: string;
    imageUrl?: string;
  };
  user: {
    nickname: string;
  };
  coupleCreatedAt?: string;
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, user, coupleCreatedAt }) => (
  <Card>
    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
      {partner.nickname} ❤️ {user.nickname}
    </div>
    {coupleCreatedAt && (
      <div style={{ color: '#E64A8D', fontWeight: 500, marginBottom: '0.5rem' }}>
        파트너 연결일: {formatDate(coupleCreatedAt)}
      </div>
    )}
    <div style={{ color: '#888' }}>
      지금 우리가 좀 더 따뜻해 지는 중!
    </div>
  </Card>
);

export default PartnerCard; 