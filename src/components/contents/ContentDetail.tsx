import React, { useState } from 'react';
import styled from 'styled-components';
import DefaultThumbnail from '../../assets/Img_contents_couple1.jpg';
import BackButton from '../common/BackButton';

interface ContentDetailProps {
  title: string;
  chip: string;
  thumbnail: string;
  content: string;
  createdAt: string;
  category?: string;
  locked?: boolean;
  onBack?: () => void;
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  min-height: 100vh;
`;

const Header = styled.div`
  position: relative;
  margin-bottom: 32px;
`;

const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LockedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

const Chip = styled.span`
  background: linear-gradient(135deg, #ff6fcb 0%, #ff8e53 100%);
  color: white;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
  font-weight: 600;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(255, 111, 203, 0.3);
`;

const Category = styled.span`
  background: #f8f9fa;
  color: #6c757d;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 12px;
  margin-left: 12px;
  font-weight: 500;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 16px 0;
  line-height: 1.3;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e9ecef;
`;

const Date = styled.span`
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
`;

const Content = styled.div`
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

const Actions = styled.div`
  display: flex;
  gap: 16px;
  padding: 24px 0;
  border-top: 1px solid #e9ecef;
  margin-bottom: 80px;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ variant }) => 
    variant === 'primary' 
      ? `
        background: linear-gradient(135deg, #ff6fcb 0%, #ff8e53 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(255, 111, 203, 0.3);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 111, 203, 0.4);
        }
      `
      : `
        background: #f8f9fa;
        color: #6c757d;
        
        &:hover {
          background: #e9ecef;
          transform: translateY(-1px);
        }
      `
  }
`;

const LikeCount = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  margin-left: 4px;
`;

const ShareButton = styled(ActionButton)`
  background: #28a745;
  color: white;
  
  &:hover {
    background: #218838;
    transform: translateY(-1px);
  }
`;

export const ContentDetail: React.FC<ContentDetailProps> = ({
  title, 
  chip, 
  thumbnail, 
  content, 
  createdAt, 
  category,
  locked = false,
  onBack
}) => {
  const [like, setLike] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  const handleLike = () => {
    setLike(prev => prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // 썸네일이 없으면 기본 이미지 사용
  const thumbnailSrc = thumbnail && thumbnail.trim() !== '' ? thumbnail : DefaultThumbnail;

  return (
    <Container>
      <Header>
        {onBack && <BackButton onClick={onBack} />}
        <Thumbnail>
          <img src={thumbnailSrc} alt={title} />
          {locked && (
            <LockedOverlay>
              🔒 프리미엄 컨텐츠
            </LockedOverlay>
          )}
        </Thumbnail>
        
        <div>
          <Chip>{chip}</Chip>
          {category && <Category>{category}</Category>}
        </div>
        
        <Title>{title}</Title>
        
        <MetaInfo>
          <Date>📅 {createdAt}</Date>
        </MetaInfo>
      </Header>

      <Content dangerouslySetInnerHTML={{ __html: content }} />

      <Actions>
        <ActionButton onClick={handleLike}>
          ❤️ 좋아요
          {like > 0 && <LikeCount>{like}</LikeCount>}
        </ActionButton>
        
        <ShareButton onClick={handleShare}>
          📤 공유하기
        </ShareButton>
        
        <ActionButton 
          variant={isBookmarked ? 'primary' : 'secondary'}
          onClick={handleBookmark}
        >
          {isBookmarked ? '🔖 저장됨' : '🔖 저장하기'}
        </ActionButton>
      </Actions>
    </Container>
  );
}; 