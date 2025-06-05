import React from 'react';
// import { useNavigate } from 'react-router-dom'; // PageLayout에서 처리하므로 제거
import styled from 'styled-components';
// import NavigationBar from '../components/NavigationBar'; // PageLayout에서 처리하므로 제거
import PageLayout from '../components/Layout/PageLayout'; // 새로 추가

// PageWrapper, ContentContainer, PageTitle, BackButton 스타일 컴포넌트는 PageLayout으로 옮겨졌으므로 제거

const InfoText = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2.5rem;
  text-align: center; // 내용 중앙 정렬 추가
`;

// BackButton은 PageLayout에서 제공하므로 여기서 제거

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  // const navigate = useNavigate(); // PageLayout에서 처리

  return (
    <PageLayout title={title} showBackButton={true}>
      <InfoText>이 페이지는 현재 준비 중입니다. 곧 만나요!</InfoText>
      {/* 뒤로가기 버튼은 PageLayout에 포함되어 있음 */}
    </PageLayout>
  );
};

export default PlaceholderPage; 