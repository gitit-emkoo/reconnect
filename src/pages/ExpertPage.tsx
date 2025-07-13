import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import NavigationBar from "../components/NavigationBar"; 
import Header from '../components/common/Header';
import ImgCounseling from '../assets/Img_counseling.jpg';
import ImgMedicine from '../assets/Img_medicine.jpg';
import ImgBeads from '../assets/Img_Beads.jpg';
import ImgLaw from '../assets/Img_Law.jpg';
import ConfirmationModal from '../components/common/ConfirmationModal';

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
  background:rgb(243, 240, 255);
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
  color:#785cd2;
`;

const CardDesc = styled.div`
  font-size: 0.98rem;
  color: #666;
  margin-top: 0.2rem;
  text-align: left;
`;

const AdSection = styled.div`
  background-color: #2f3542;
  border-radius: 1rem;
  padding: 1.2rem;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  color: #fff;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 400px;
  &:hover {
    background-color: #3d4453;
  }
`;

const AdTitle = styled.h2`
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
`;

const AdText = styled.p`
  font-size: 0.8rem;
  opacity: 0.8;
`;


const ExpertPage: React.FC = () => {
  const navigate = useNavigate();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const handleComingSoon = () => setShowComingSoon(true);
  return (
    <>
      <Header title="전문가" />
      <Container>
        <CardList>
          <Card onClick={() => navigate('/expert/self-diagnosis')} style={{cursor:'pointer'}}>
            <CardImg src={ImgCounseling} alt="진단" />
            <CardText>
              <CardTitle>자기이해 진단실</CardTitle>
              <CardDesc>검증된 이론과 AI 분석으로 설계된 자기 이해 진단</CardDesc>
            </CardText>
          </Card>
          <Card onClick={handleComingSoon} style={{cursor:'pointer'}}>
            <CardImg src={ImgMedicine} alt="감정심리 상담실" />
            <CardText>
              <CardTitle>감정심리 상담실</CardTitle>
              <CardDesc>정서적 회복이 필요한 분</CardDesc>
            </CardText>
          </Card>
          <Card onClick={handleComingSoon} style={{cursor:'pointer'}}>
            <CardImg src={ImgBeads} alt="인연궁합 상담실" />
            <CardText>
              <CardTitle>인연궁합 상담실</CardTitle>
              <CardDesc>운명과 타이밍이 궁금한 분</CardDesc>
            </CardText>
          </Card>
          <Card onClick={handleComingSoon} style={{cursor:'pointer'}}>
            <CardImg src={ImgLaw} alt="법률 상담소" />
            <CardText>
              <CardTitle>법률 상담소</CardTitle>
              <CardDesc>인연과 감정의 방</CardDesc>
            </CardText>
          </Card>
        </CardList>
        <AdSection onClick={() => navigate('/expert')}>
          <AdTitle>광고입니다</AdTitle>
          <AdText>광고 넣을 페이지 입니다.</AdText>
        </AdSection>
      </Container>
      <ConfirmationModal
        isOpen={showComingSoon}
        onRequestClose={() => setShowComingSoon(false)}
        onConfirm={() => setShowComingSoon(false)}
        message="정식 오픈 전입니다."
        showCancelButton={false}
        confirmButtonText="확인"
      />
      <NavigationBar />
    </>
  );
};

export default ExpertPage;