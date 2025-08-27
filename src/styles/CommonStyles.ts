import styled from 'styled-components';

// 네비게이션과 안전영역을 고려한 하단 여백 믹스인
export const withNavSafeBottom = `
  padding-bottom: calc(var(--nav-height, 72px) + var(--safe-area-inset-bottom, 0px) + 16px) !important;
`;

// 공통 Container 스타일
export const Container = styled.div`
  background-color: white;
  min-height: calc(var(--vh, 1vh) * 100);
  min-height: 100dvh;
  padding: 1rem;
  padding-bottom: 4rem; /* 작은 화면에서 하단 여백 확보 */
  /* 내부 스크롤 컨테이너가 있을 경우에도 하단 여백이 보장되도록 */
  & > *:last-child { margin-bottom: 0; }
  
  /* 반응형 패딩 */
  @media screen and (max-width: 768px) {
    padding: 2rem 1rem 6rem;
    
  }
  
  /* 큰 화면에서 더 넓은 여백 */
  @media screen and (min-width: 1024px) {
    padding: 2rem;
    padding-bottom: 2rem;
  }
`;

// NavigationBar가 없는 페이지용 Container (로그인, 회원가입 등)
export const AuthContainer = styled.div`
  background-color: white;
  min-height: calc(var(--vh, 1vh) * 100);
  min-height: 100dvh;
  padding: 2rem 1rem 4rem 1rem; /* 하단 패딩 증가 */
  
  /* 반응형 패딩 */
  @media screen and (max-width: 768px) {
    padding: 1rem 0.5rem 3rem 0.5rem; /* 작은 화면에서 하단 여백 확보 */
  }
  
  /* 큰 화면에서 더 넓은 여백 */
  @media screen and (min-width: 1024px) {
    padding: 3rem 2rem 4rem 2rem;
  }
`;

// 특별한 여백이 필요한 페이지용 Container
export const CustomContainer = styled.div<{
  $topPadding?: string;
  $bottomPadding?: string;
  $horizontalPadding?: string;
}>`
  background-color: white;
  min-height: 100vh;
  /* 기본 패딩 */
  padding: ${props => props.$topPadding || '1rem'} ${props => props.$horizontalPadding || '1rem'} ${props => props.$bottomPadding || '1rem'};
  & > *:last-child { margin-bottom: 0; }
  
  /* 반응형 패딩 */
  @media screen and (max-width: 768px) {
    padding: ${props => props.$topPadding || '0.5rem'} ${props => props.$horizontalPadding || '0.5rem'} ${props => props.$bottomPadding || '0.5rem'};
  }
`;