import styled from 'styled-components';

// 공통 Container 스타일
export const Container = styled.div`
  background-color: white;
  min-height: 100vh;
  padding: 1rem;
  /* 하단 여백은 #root.has-nav가 담당 → 컴포넌트 자체에서는 일반 패딩만 유지 */
  padding-bottom: 1rem;
  
  /* 반응형 패딩 */
  @media screen and (max-width: 768px) {
    padding: 0.5rem;
    padding-bottom: 0.5rem;
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
  min-height: 100vh;
  padding: 2rem 1rem;
  
  /* 반응형 패딩 */
  @media screen and (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
  
  /* 큰 화면에서 더 넓은 여백 */
  @media screen and (min-width: 1024px) {
    padding: 3rem 2rem;
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
  /* 기본적으로 네비 높이는 루트에서 처리 → 여기서는 명시 전달 없으면 일반 패딩만 */
  padding: ${props => props.$topPadding || '1rem'} ${props => props.$horizontalPadding || '1rem'} ${props => props.$bottomPadding || '1rem'};
  
  /* 반응형 패딩 */
  @media screen and (max-width: 768px) {
    padding: ${props => props.$topPadding || '0.5rem'} ${props => props.$horizontalPadding || '0.5rem'} ${props => props.$bottomPadding || '0.5rem'};
  }
`;