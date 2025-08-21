import React from 'react';
import styled from 'styled-components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Card = styled.div`
  border: none;
  border-radius: 1.2rem;
  background: linear-gradient(135deg, #FFEFF6 0%,rgb(219, 236, 255) 100%);
  
  padding: 1.2rem;
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
  min-width: 0;
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileName = styled.div`
  font-size: 1.2rem;
  margin-top: 2px;
  color:rgb(78, 78, 78);
  font-weight: 600;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeartLottie = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.5rem;
  flex: 0 0 auto;
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
      <HeartLottie>
        <DotLottieReact
          src="https://lottie.host/917b78f1-4ec2-49d2-9716-7bbeebd44200/ZMLFM28xZ9.lottie"
          loop
          autoplay
          style={{ width: '70px', height: '70px' }}
        />
      </HeartLottie>
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