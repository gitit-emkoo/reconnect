import React from 'react';
import styled from 'styled-components';
import NavigationBar from '../NavigationBar'; // NavigationBar 경로 수정 가능성 있음
import CommonBackButton from '../common/BackButton'; // 경로 수정 및 이름 변경 (기존 BackButton과 충돌 방지)

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  background-color: #f9f9f9; /* 기본 배경색 */
`;

// EmotionCard.tsx의 PageHeaderContainer 스타일 참고
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center; // 내부 요소들을 가로 중앙에 배치 (타이틀 기준)
  width: 100%;
  padding: 1.6rem 1.5rem; /* 패딩은 유지 또는 조정 */
  position: relative; // BackButton을 왼쪽에 배치하기 위한 기준점
  min-height: 56px; // 헤더 최소 높이 (BackButton 크기 등 고려)
`;

// EmotionCard.tsx의 PageTitle 스타일 참고
const PageTitle = styled.h1`
  font-size: 1.25rem; /* EmotionCard와 유사하게 조정 */
  font-weight: 600;
  color: #2d3748; /* EmotionCard와 유사하게 조정 */
  text-align: center;
  /* flex-grow: 1; // BackButton이 absolute이므로 flex-grow는 불필요할 수 있음 */
  /* Header의 justify-content: center가 제목을 중앙에 배치합니다. */
  /* 필요한 경우 width: 100%; 추가하여 text-align: center가 확실히 적용되도록 할 수 있음 */
`;

// EmotionCard.tsx의 StyledBackButton 스타일 참고
const StyledCommonBackButton = styled(CommonBackButton)`
  /*
  position: absolute;
  left: 1rem; // 패딩 고려하여 조정
  top: 50%;
  transform: translateY(-50%);
  */
  // common/BackButton 자체 스타일(top: 20px, left: 20px, position: absolute 등)을 따르도록 위치 관련 스타일 제거.
  // PageLayout에 특화된 추가 스타일이 필요하다면 여기에 작성합니다. (예: margin 조정 등)
`;

const ContentArea = styled.main`
  flex-grow: 1;
  padding: 1.5rem;
  padding-bottom: var(--nav-height, 80px);
  /* background-color: white; // 페이지별로 배경색을 다르게 할 수 있도록 PageLayout에서는 제거 */
`;

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children, showBackButton = true }) => {
  

  return (
    <PageWrapper>
      <Header>
        {showBackButton && (
          // 기존 버튼 대신 common/BackButton 사용
          <StyledCommonBackButton />
          // navigate(-1)은 CommonBackButton 내부에서 처리됨
        )}
        <PageTitle>{title}</PageTitle>
      </Header>
      <ContentArea>
        {children}
      </ContentArea>
      <NavigationBar />
    </PageWrapper>
  );
};

export default PageLayout; 