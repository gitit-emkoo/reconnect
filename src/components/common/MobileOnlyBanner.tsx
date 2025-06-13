import React from 'react';
import styled from 'styled-components';

const Banner = styled.div`
  display: none;
  @media (min-width: 601px) {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 60px;
    background:rgb(252, 191, 239);
    color:rgb(71, 0, 82);
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: 600;
    z-index: 2000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
`;

const MobileOnlyBanner: React.FC = () => (
  <Banner>
    이 서비스는 <b>모바일 환경</b>에 최적화되어 있습니다.
  </Banner>
);

export default MobileOnlyBanner;