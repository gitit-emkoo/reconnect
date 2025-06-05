import React from 'react';
import styled from 'styled-components';
import PageLayout from '../components/Layout/PageLayout';
import AnnouncementItem from '../components/common/AnnouncementItem'; // 경로 수정

const AnnouncementListContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const dummyAnnouncements = [
  {
    id: 1,
    title: '리커넥트 서비스 정식 출시 안내',
    date: '2025-06-07',
    content: (
      <>
        <p>안녕하세요, 리커넥트 팀입니다.</p>
        <p>드디어 리커넥트 서비스가 정식으로 출시되었습니다! 많은 관심과 사랑 부탁드립니다.</p>
        <p>주요 기능:</p>
        <ul>
          <li>감정 카드 교환</li>
          <li>커플 미션</li>
          <li>관계 진단</li>
        </ul>
        <p>앞으로 더 좋은 서비스를 제공하기 위해 노력하겠습니다. 감사합니다.</p>
      </>
    ),
  },
  {
    id: 2,
    title: '서버 점검 안내 (06/06 02:00 ~ 04:00)',
    date: '2024-06-05',
    content: <p>보다 안정적인 서비스 제공을 위해 8월 1일 새벽 2시부터 4시까지 서버 점검이 진행될 예정입니다. 이용에 참고해주시기 바랍니다.</p>,
  },
  {
    id: 3,
    title: '개인정보처리방침 개정 안내',
    date: '2024-06-03',
    content: <p>2024년 8월 12일자로 개인정보처리방침이 개정될 예정입니다. 자세한 내용은 [개인정보처리방침] 페이지를 참고해주십시오.</p>,
  },
];

const AnnouncementsPage: React.FC = () => {
  return (
    <PageLayout title="공지사항" showBackButton={true}>
      <AnnouncementListContainer>
        {dummyAnnouncements.map(announcement => (
          <AnnouncementItem 
            key={announcement.id} 
            title={announcement.title} 
            date={announcement.date} 
            content={announcement.content} 
          />
        ))}
      </AnnouncementListContainer>
    </PageLayout>
  );
};

export default AnnouncementsPage; 