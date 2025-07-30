import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ContentList } from '../components/contents/ContentList';
import { ContentDetail } from '../components/contents/ContentDetail';
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
  bottom: 80px;
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

const PageContainer = styled.div`
  position: relative;
  height: auto;
  padding-bottom: 60px; /* NavigationBar 높이만큼 여백 */
`;

const ContentCenter: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);

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

  const handleContentClickFromModal = (id: string) => {
    setSelectedId(id);
    setIsBookmarkModalOpen(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <MobileOnlyBanner />
      <Header
        title="관계 가이드"
        showBackButton={!!selectedId}
        onBackClick={() => setSelectedId(null)}
      />
      {error && <ErrorModal open={!!error} message={error} onClose={() => setError(null)} />}
      {!selectedId ? (
        <ContentList onCardClick={setSelectedId} contents={contents} />
      ) : (
        <div>
          <ContentDetail
            id={selectedId}
          />
        </div>
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