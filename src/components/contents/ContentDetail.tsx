import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { formatInKST } from '../../utils/date';
import {
  fetchContentById,
  likeContent,
  unlikeContent,
  bookmarkContent,
  unbookmarkContent,
} from '../../api/content';
import { Content } from '../../types/content';
import LoadingSpinner from '../common/LoadingSpinner';

interface ContentDetailProps {
  id: string;
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  height: auto;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.4;
  margin: 0;
  text-align: center;
  padding: 16px 0;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e9ecef;
`;

const DateText = styled.span`
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
`;

const ContentBody = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #495057;
  margin-bottom: 40px;
  
  h2, h3 {
    color: #2c3e50;
    margin: 24px 0 16px 0;
  }
  
  p {
    margin-bottom: 16px;
  }
  
  ul, ol {
    margin: 16px 0;
    padding-left: 24px;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  blockquote {
    background: #f8f9fa;
    border-left: 4px solid #ff6fcb;
    padding: 16px 20px;
    margin: 24px 0;
    border-radius: 0 8px 8px 0;
    font-style: italic;
  }
`;

const ActionToolbar = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid #e9ecef;
  background: white;
  position: sticky;
  bottom: 0;
`;

const ActionButton = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${({ active }) => (active ? '#ff6fcb' : '#495057')};
  font-weight: ${({ active }) => (active ? '600' : '500')};

  span {
    font-size: 24px;
  }
`;

export const ContentDetail: React.FC<ContentDetailProps> = ({ id }) => {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const data = await fetchContentById(id);
        setContent(data);
      } catch (err) {
        setError('콘텐츠를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [id]);

  const handleLike = async () => {
    if (!content) return;
    const isCurrentlyLiked = content.isLiked;
    const newLikesCount = content.likesCount! + (isCurrentlyLiked ? -1 : 1);

    setContent(prev => prev && { ...prev, isLiked: !isCurrentlyLiked, likesCount: newLikesCount });

    try {
      if (isCurrentlyLiked) {
        await unlikeContent(id);
      } else {
        await likeContent(id);
      }
    } catch (err) {
      // 에러 발생 시 원래 상태로 복구
      setContent(prev => prev && { ...prev, isLiked: isCurrentlyLiked, likesCount: content.likesCount! });
    }
  };

  const handleBookmark = async () => {
    if (!content) return;
    const isCurrentlyBookmarked = content.isBookmarked;
    
    setContent(prev => prev && { ...prev, isBookmarked: !isCurrentlyBookmarked });

    try {
      if (isCurrentlyBookmarked) {
        await unbookmarkContent(id);
      } else {
        await bookmarkContent(id);
      }
    } catch (err) {
      setContent(prev => prev && { ...prev, isBookmarked: isCurrentlyBookmarked });
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content?.title,
        text: '이 콘텐츠를 확인해보세요!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>{error}</div>;
  if (!content) return <div>콘텐츠를 찾을 수 없습니다.</div>;

  return (
    <div style={{ paddingBottom: '80px' }}>
      <Container>
        <Title>{content.title}</Title>
        <MetaInfo>
          <DateText>{formatInKST(content.createdAt, 'yyyy.MM.dd')}</DateText>
        </MetaInfo>
        <ContentBody dangerouslySetInnerHTML={{ __html: content.body }} />
      </Container>
      <ActionToolbar>
        <ActionButton active={content.isLiked} onClick={handleLike}>
          <span>{content.isLiked ? '❤️' : '🤍'}</span>
          좋아요 {content.likesCount}
        </ActionButton>
        <ActionButton active={content.isBookmarked} onClick={handleBookmark}>
          <span>{content.isBookmarked ? '🔖' : '🏷️'}</span>
          저장
        </ActionButton>
        <ActionButton onClick={handleShare}>
          <span>🔗</span>
          공유
        </ActionButton>
      </ActionToolbar>
    </div>
  );
};