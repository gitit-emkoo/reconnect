import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  border: 1px solid transparent;
  border-radius: 1.2rem;
  background-image: linear-gradient(#fff, #fff), 
    linear-gradient(to right, rgb(253, 102, 203) 0%, rgb(138, 52, 251) 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  
  padding: 0.1rem 0.1rem;
  text-align: center;
  margin-top: 1.5rem;
  // box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 1rem 1rem;
  padding: 0 1rem;
`;

const ProfileCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const ProfileName = styled.div`
  font-size: 1.2rem;
  margin-top: 2px;
  color:rgb(78, 78, 78);
  font-weight: 600;
`;

const HeartIcon = styled.div`
  font-size: 1.5rem;
  color: #ff69b4;
  margin: 0 0.5rem;
`;

interface PartnerCardProps {
  partner: {
    id: string;
    nickname: string;
    email: string;
    profileImageUrl?: string;
  };
  user: {
    nickname: string;
    email?: string;
    profileImageUrl?: string;
  };
  coupleCreatedAt?: string;
  activeChallengeTitle?: string;
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, user, coupleCreatedAt, activeChallengeTitle }) => (
  <Card>
    <ProfileSection>
      <ProfileCol>
        <ProfileImage src={user.profileImageUrl || '/default-avatar.svg'} alt={user.nickname} />
        <ProfileName>{user.nickname}</ProfileName>
      </ProfileCol>
      <HeartIcon>❤️</HeartIcon>
      <ProfileCol>
        <ProfileImage src={partner.profileImageUrl || '/default-avatar.svg'} alt={partner.nickname} />
        <ProfileName>{partner.nickname}</ProfileName>
      </ProfileCol>
    </ProfileSection>
    
    {/* <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.4rem' }}>
      {user.nickname} ❤️ {partner.nickname}
    </div> */}
    <div style={{ color: '#E64A8D', fontWeight: 500, fontSize: '0.95rem', marginBottom: '0.3rem' }}>
      {coupleCreatedAt ? `파트너 연결일: ${formatDate(coupleCreatedAt)}` : '연결 정보를 불러오는 중...'}
    </div>
    <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
      {activeChallengeTitle ? (
        <>
          <span style={{ color: '#8e44ad', fontWeight: 600 }}>{activeChallengeTitle}</span><br/> 챌린지 진행중
        </>
      ) : (
        '지금 우리가 좀 더 따뜻해 지는 중!'
      )}
    </div>
  </Card>
);

export default PartnerCard; 