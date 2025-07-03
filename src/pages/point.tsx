import React from 'react';
import Header from '../components/common/Header';
import BackButton  from '../components/common/BackButton';
import styled from 'styled-components';
import NavigationBar from '../components/NavigationBar';

const Container = styled.div`
  background-color: white;
  min-height: 100vh;
  padding: 2rem;
  padding-bottom: 70px; /* NavigationBar 높이만큼 패딩 */
`;

const PointPage: React.FC = () => {
  return (
    <>
    <Header title="포인트(코인)" />
    <BackButton />
    <Container>
      <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
        추후 포인트(코인) 관련 기능이 이곳에 표시됩니다.
      </div>
    </Container>
    <NavigationBar />
    </>
  );
};

export default PointPage; 