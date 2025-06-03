import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
`;

const Title = styled.h1`
  font-size: 120px;
  font-weight: bold;
  background: linear-gradient(135deg, #FF69B4 0%, #4169E1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.h2`
  font-size: 24px;
  color: #4b5563;
  margin: 20px 0;
  text-align: center;
`;

const Description = styled.p`
  font-size: 16px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 30px;
  max-width: 500px;
`;

const HomeButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #FF69B4 0%, #4169E1 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Subtitle>페이지를 찾을 수 없습니다</Subtitle>
      <Description>
        죄송합니다. 요청하신 페이지를 찾을 수 없습니다. 
        페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
      </Description>
      <HomeButton onClick={() => navigate('/')}>
        홈으로 돌아가기
      </HomeButton>
    </NotFoundContainer>
  );
};

export default NotFound; 