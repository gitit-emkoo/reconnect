import React from 'react';
import styled from 'styled-components';
import BackButton from '../common/BackButton';

// 뒤로가기 버튼과 페이지 타이틀을 묶는 컨테이너
const PageHeaderContainer = styled.div`
  display: flex;
  align-items: center; // BackButton과 PageTitle을 세로 중앙 정렬
  justify-content: center; // 내부 요소들을 가로 중앙에 배치 (타이틀 기준)
  width: 100%; // PageContainer의 align-items:center에 의해 중앙 정렬되도록 너비 확보
  max-width: 600px; // ContentWrapper와 동일한 최대 너비로 일관성 유지
  margin-bottom: 1.5rem; // ContentWrapper와의 간격
  position: relative; // BackButton을 왼쪽에 배치하기 위한 기준점
`;

const StyledBackButton = styled(BackButton)`
  position: absolute; // PageHeaderContainer를 기준으로 절대 위치
  left: 0; // 왼쪽에 배치
  top: 50%; // 세로 중앙 정렬 시도
  transform: translateY(-50%); // 세로 중앙 정렬 시도
`;

const PageTitle = styled.h2`
  font-size: 1.75rem; // 기본 글씨 크기
  font-weight: 600;
  color: #2d3748;
  text-align: center;
  // margin-bottom 제거 (PageHeaderContainer에서 관리)
  // PageHeaderContainer의 justify-content:center로 인해 중앙 정렬됨

  @media (max-width: 768px) { // 모바일 화면 크기 (예: 768px 이하)
    font-size: 1.2rem; // 모바일에서 글씨 크기 조정
  }
`;

interface EmotionCardHeaderProps {
  title: string;
}

const EmotionCardHeader: React.FC<EmotionCardHeaderProps> = ({ title }) => {
  return (
    <PageHeaderContainer>
      <StyledBackButton />
      <PageTitle>{title}</PageTitle>
    </PageHeaderContainer>
  );
};

export default EmotionCardHeader; 