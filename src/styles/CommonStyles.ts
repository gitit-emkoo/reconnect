import styled from 'styled-components';

// 공통 Container 스타일
export const Container = styled.div`
  background-color: white;
  min-height: 100vh;
  padding: 1rem;
  
  /* NavigationBar가 있는 페이지를 위한 하단 여백 */
  padding-bottom: calc(1rem + var(--nav-height, 80px));
  
  /* 반응형 패딩 */
  @media screen and (max-width: 768px) {
    padding: 0.5rem;
    padding-bottom: calc(0.5rem + var(--nav-height, 80px));
  }
  
  /* 큰 화면에서 더 넓은 여백 */
  @media screen and (min-width: 1024px) {
    padding: 2rem;
    padding-bottom: calc(2rem + var(--nav-height, 80px));
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
  padding: ${props => props.$topPadding || '1rem'} ${props => props.$horizontalPadding || '1rem'} ${props => props.$bottomPadding || 'calc(1rem + var(--nav-height, 80px))'};
  
  /* 반응형 패딩 */
  @media screen and (max-width: 768px) {
    padding: ${props => props.$topPadding || '0.5rem'} ${props => props.$horizontalPadding || '0.5rem'} ${props => props.$bottomPadding || 'calc(0.5rem + var(--nav-height, 80px))'};
  }
`;