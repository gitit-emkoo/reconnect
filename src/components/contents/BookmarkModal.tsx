import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchBookmarkedContents } from '../../api/content';
import { Content } from '../../types/content';
import LoadingSpinner from '../common/LoadingSpinner';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContentClick: (id: string) => void;
}

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 24px;
  line-height: 1;
  color: #888;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`;

const ContentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ContentItem = styled.li`
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  &:hover {
    background-color: #f9f9f9;
  }
`;

export const BookmarkModal: React.FC<BookmarkModalProps> = ({ isOpen, onClose, onContentClick }) => {
  const [bookmarked, setBookmarked] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadBookmarked = async () => {
        setLoading(true);
        try {
          const data = await fetchBookmarkedContents();
          setBookmarked(data);
        } catch (error) {
          console.error('북마크된 콘텐츠를 불러오는데 실패했습니다.', error);
        } finally {
          setLoading(false);
        }
      };
      loadBookmarked();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>저장한 아티클</ModalTitle>
          <CloseButton onClick={onClose}>
            ✕
          </CloseButton>
        </ModalHeader>
        {loading ? (
          <LoadingSpinner />
        ) : bookmarked.length > 0 ? (
          <ContentList>
            {bookmarked.map((content) => (
              <ContentItem key={content.id} onClick={() => onContentClick(content.id)}>
                {content.title}
              </ContentItem>
            ))}
          </ContentList>
        ) : (
          <p>저장된 아티클이 없습니다.</p>
        )}
      </ModalContent>
    </ModalBackdrop>
  );
};