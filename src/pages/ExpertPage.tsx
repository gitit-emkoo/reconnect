// src/pages/ExpertPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import NavigationBar from "../components/NavigationBar"; // NavigationBar 임포트
import Header from '../components/common/Header';
import ImgCounseling from '../assets/Img_counseling.jpg';
import ImgBeads from '../assets/Img_Beads.jpg';
import ImgLaw from '../assets/Img_Law.jpg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 60px);
  background: white;
  padding: 2rem;
  padding-bottom: 80px;
  justify-content: flex-start;
  text-align: center;
  padding-top: 3.5rem;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  background: #faf8f6;
  border-radius: 1.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.2rem 1rem;
  gap: 1.2rem;
`;

const CardImg = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CardTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color:rgb(162, 14, 185);
`;

const CardDesc = styled.div`
  font-size: 0.98rem;
  color: #666;
  margin-top: 0.2rem;
`;

const ExpertPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header title="전문가" />
      <Container>
        <CardList>
          <Card onClick={() => navigate('/expert/self-diagnosis')} style={{cursor:'pointer'}}>
            <CardImg src={ImgCounseling} alt="진단" />
            <CardText>
              <CardTitle>자기이해 진단실</CardTitle>
              <CardDesc>나를 좀더 깊게 알고싶다면</CardDesc>
            </CardText>
          </Card>
          <Card>
            <CardImg src={ImgCounseling} alt="감정심리 상담실" />
            <CardText>
              <CardTitle>감정심리 상담실</CardTitle>
              <CardDesc>정서적 회복이 필요한 분</CardDesc>
            </CardText>
          </Card>
          <Card>
            <CardImg src={ImgBeads} alt="인연궁합 상담실" />
            <CardText>
              <CardTitle>인연궁합 상담실</CardTitle>
              <CardDesc>운명과 타이밍이 궁금한 분</CardDesc>
            </CardText>
          </Card>
          <Card>
            <CardImg src={ImgLaw} alt="법률 상담소" />
            <CardText>
              <CardTitle>법률 상담소</CardTitle>
              <CardDesc>관계의 현실적 마무리가 고민이라면</CardDesc>
            </CardText>
          </Card>
        </CardList>
      </Container>
      <NavigationBar />
    </>
  );
};

export default ExpertPage;