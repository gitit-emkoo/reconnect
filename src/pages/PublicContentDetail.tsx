import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchContentById, likeContent, unlikeContent, bookmarkContent, unbookmarkContent } from '../api/content';
import { Content } from '../types/content';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorModal from '../components/common/ErrorModal';
import LoginModal from '../components/common/LoginModal';
import BackButton from '../components/common/BackButton';
import useAuthStore from '../store/authStore';
import { formatInKST } from '../utils/date';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  height: auto;
`;

const Header = styled.header`
  background: white;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: auto auto;
  border-bottom: 1px solid #f3f3f3;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  text-align: center;
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

const PublicContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore(); 
  
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchContentById(id);
        setContent(data);
        setIsLiked(data.isLiked || false);
        setIsBookmarked(data.isBookmarked || false);
      } catch (err) {
        setError('컨텐츠를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  const handleBack = () => {
    if (isAuthenticated) {
      navigate(-1);
    } else {
      // 비로그인 사용자는 온보딩 페이지로 이동
      navigate('/onboarding');
    }
  };

  const handleAction = async (action: 'like' | 'bookmark' | 'share') => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!content) return;

    // 로그인된 사용자의 경우 실제 액션 수행
    switch (action) {
      case 'like':
        const newIsLiked = !isLiked;
        const newLikesCount = content.likesCount! + (newIsLiked ? 1 : -1);
        
        // 낙관적 업데이트
        setIsLiked(newIsLiked);
        setContent(prev => prev && { ...prev, likesCount: newLikesCount });
        
        try {
          if (newIsLiked) {
            await likeContent(content.id);
          } else {
            await unlikeContent(content.id);
          }
        } catch (err) {
          // 에러 발생 시 원래 상태로 복구
          setIsLiked(!newIsLiked);
          setContent(prev => prev && { ...prev, likesCount: content.likesCount! });
          console.error('좋아요 처리 실패:', err);
        }
        break;
      case 'bookmark':
        const newIsBookmarked = !isBookmarked;
        
        // 낙관적 업데이트
        setIsBookmarked(newIsBookmarked);
        
        try {
          if (newIsBookmarked) {
            await bookmarkContent(content.id);
          } else {
            await unbookmarkContent(content.id);
          }
        } catch (err) {
          // 에러 발생 시 원래 상태로 복구
          setIsBookmarked(!newIsBookmarked);
          console.error('저장 처리 실패:', err);
        }
        break;
      case 'share':
        handleShare();
        break;
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/content/${content?.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: content?.title || '부부 처방소',
          text: content?.title || '부부 처방소',
          url: shareUrl,
        });
      } catch (err) {
        console.log('공유 취소됨');
      }
    } else {
      // 폴백: 클립보드에 복사
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('링크가 클립보드에 복사되었습니다!');
      } catch (err) {
        alert('링크 복사에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!content) {
    return <ErrorModal open={true} message="컨텐츠를 찾을 수 없습니다." onClose={() => navigate('/')} />;
  }

  return (
    <div>
      <Header>
        <BackButton onClick={handleBack} />
        <HeaderTitle>부부 처방소</HeaderTitle>
      </Header>

      <div style={{ paddingBottom: '80px' }}>
        <Container>
          <Title>{content.title}</Title>
          <MetaInfo>
            <DateText>{formatInKST(content.createdAt, 'yyyy.MM.dd')}</DateText>
          </MetaInfo>
          <ContentBody dangerouslySetInnerHTML={{ __html: content.body }} />
        </Container>
        <ActionToolbar>
          <ActionButton 
            active={isLiked}
            onClick={() => handleAction('like')}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span>
            좋아요 {content.likesCount || 0}
          </ActionButton>
          <ActionButton 
            active={isBookmarked}
            onClick={() => handleAction('bookmark')}
          >
            <span>{isBookmarked ? '🔖' : '🏷️'}</span>
            저장
          </ActionButton>
          <ActionButton onClick={() => handleAction('share')}>
            <span>🔗</span>
            공유
          </ActionButton>
        </ActionToolbar>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setShowLoginModal(false)}
      />
      
      {error && (
        <ErrorModal 
          open={!!error} 
          message={error || ''} 
          onClose={() => setError(null)} 
        />
      )}
    </div>
  );
};

export default PublicContentDetail; 