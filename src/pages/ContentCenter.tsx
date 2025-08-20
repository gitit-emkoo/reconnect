import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container as BaseContainer } from '../styles/CommonStyles';
import { ContentList } from '../components/contents/ContentList';
import { ContentList as ContentListView } from '../components/contents/ContentListView';
import NavigationBar from '../components/NavigationBar';
import Header from '../components/common/Header';
import MobileOnlyBanner from '../components/common/MobileOnlyBanner';
import { fetchContents } from '../api/content';
import { Content } from '../types/content';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorModal from '../components/common/ErrorModal';
import { BookmarkModal } from '../components/contents/BookmarkModal';
import IconBookmarkContents from '../assets/Icon_bookmarkContents.png';
import IconListView from '../assets/Icon_listView.png';
import IconCardView from '../assets/Icon_cardView.png';

const FloatingButton = styled.button`
  position: fixed;
  bottom: 140px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 2001;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  img {
    width: 40px;
    height: 40px;
    display: block;
  }
`;

const ViewToggleButton = styled.button`
  position: fixed;
  bottom: 200px;
  right: 20px;
  background: white;
  border: 1px solid #e9ecef;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 2000;

  &:hover {
    background-color: #f8f9fa;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 24px;
    height: 24px;
    display: block;
  }
`;

const HeaderContainer = styled.div`
  position: relative;
`;

const Container = styled(BaseContainer)`
  position: relative;
`;

const ContentCenter: React.FC = () => {
  const navigate = useNavigate();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  useEffect(() => {
    const getContents = async () => {
      try {
        setLoading(true);
        const data = await fetchContents();
        setContents(data);
      } catch (err) {
        setError('콘텐츠를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getContents();
  }, []);

  const handleContentClick = (id: string) => {
    navigate(`/content/${id}`);
  };

  const handleContentClickFromModal = (id: string) => {
    navigate(`/content/${id}`);
    setIsBookmarkModalOpen(false);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'card' ? 'list' : 'card');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <MobileOnlyBanner />
      <HeaderContainer>
        <Header
          title="부부 처방소"
          showBackButton={false}
        />
      </HeaderContainer>
      {error && <ErrorModal open={!!error} message={error} onClose={() => setError(null)} />}
      {viewMode === 'card' ? (
        <ContentList onCardClick={handleContentClick} contents={contents} />
      ) : (
        <ContentListView onCardClick={handleContentClick} contents={contents} />
      )}
      <ViewToggleButton onClick={toggleViewMode}>
        <img 
          src={viewMode === 'card' ? IconListView : IconCardView} 
          alt={viewMode === 'card' ? '리스트 보기' : '카드 보기'} 
        />
      </ViewToggleButton>
      <FloatingButton onClick={() => setIsBookmarkModalOpen(true)}>
        <img src={IconBookmarkContents} alt="저장한 아티클" />
      </FloatingButton>
      <BookmarkModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        onContentClick={handleContentClickFromModal}
      />
      <NavigationBar />
    </Container>
  );
};

export default ContentCenter;