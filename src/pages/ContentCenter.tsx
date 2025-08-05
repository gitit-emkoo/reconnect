import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
import IconBookmark from '../assets/Icon_Bookmark.png';

const FloatingButton = styled.button`
  position: fixed;
  bottom: 140px;
  right: 20px;
  background: none;
  border: none;
  padding: 8px;
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
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
  font-size: 20px;
  color: #666;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const HeaderContainer = styled.div`
  position: relative;
`;

const PageContainer = styled.div`
  position: relative;
  height: auto;
  padding-bottom: 60px; /* NavigationBar 높이만큼 여백 */
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
    <PageContainer>
      <MobileOnlyBanner />
      <HeaderContainer>
        <Header
          title="관계 가이드"
          showBackButton={false}
        />
        <ViewToggleButton onClick={toggleViewMode}>
          {viewMode === 'card' ? '📋' : '🃏'}
        </ViewToggleButton>
      </HeaderContainer>
      {error && <ErrorModal open={!!error} message={error} onClose={() => setError(null)} />}
      {viewMode === 'card' ? (
        <ContentList onCardClick={handleContentClick} contents={contents} />
      ) : (
        <ContentListView onCardClick={handleContentClick} contents={contents} />
      )}
      <FloatingButton onClick={() => setIsBookmarkModalOpen(true)}>
        <img src={IconBookmark} alt="저장한 아티클" />
      </FloatingButton>
      <BookmarkModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        onContentClick={handleContentClickFromModal}
      />
      <NavigationBar />
    </PageContainer>
  );
};

export default ContentCenter;