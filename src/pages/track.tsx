import React from 'react';
import Header from '../components/common/Header';
import styled from 'styled-components';
import NavigationBar from '../components/NavigationBar';
import BackButton  from '../components/common/BackButton';

const Container = styled.div`
  background-color: white;
  min-height: 100vh;
  padding: 2rem;
  padding-bottom: 70px; /* NavigationBar 높이만큼 패딩 */
`;

const TrackPage: React.FC = () => {
  return (
    <>
    <Header title="감정 트랙(감정일기 리포트)" />
    <BackButton />
    <Container>
    
      <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
        추후 감정일기 리포트 기능이 이곳에 표시됩니다.
      </div>
    
    </Container>
    <NavigationBar />
    </>
  );
};

export default TrackPage; 