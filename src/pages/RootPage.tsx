import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #FFE5E5 0%, #E5E5FF 100%);
  padding: 3rem 1.5rem;
`;

const Logo = styled.img`
  width: 140px;
  height: auto;
  margin-bottom: 2rem;
`;

const IllustrationWrapper = styled.div`
  width: 100%;
  max-width: 340px;
  aspect-ratio: 16/10;
  position: relative;
  border-radius: 20px;
  margin-bottom: 2.5rem;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 2px solid #9370DB;
  padding: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2.5rem;
  text-align: center;
`;

const Button = styled.button`
  width: 100%;
  max-width: 340px;
  padding: 1rem;
  border: none;
  border-radius: 30px;
  background: linear-gradient(to right, #FF69B4, #4169E1);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-2px);
  }
`;

const LinkText = styled.p`
  margin-top: 0.5rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;

  a {
    color: #FF69B4;
    text-decoration: underline;
    font-weight: 400;
    margin-left: 0.25rem;
    cursor: pointer;
  }
`;

const RootPage: React.FC = () => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <Container>
      <Logo 
        src="/images/reconnect.png" 
        alt="Reconnect" 
        onLoad={() => setLogoLoaded(true)}
        style={{ opacity: logoLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
      />
      <IllustrationWrapper>
        <img 
          src="/images/img1.jpg" 
          alt="Couple illustration" 
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
        />
      </IllustrationWrapper>
      <Title>다시 관계를 이어보세요</Title>
      <Subtitle>당신의 관계, 리커넥트가 도와줄게요</Subtitle>
      <Button onClick={() => navigate('/login')}>
        LOG IN
      </Button>
      <LinkText>
        계정이 없으신가요?
        <a onClick={() => navigate('/register')}>회원가입</a>
      </LinkText>
    </Container>
  );
};

export default RootPage; 