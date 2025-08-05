import React from 'react';
import styled from 'styled-components';
import { Content, ContentType } from '../../types/content';

interface ContentListViewProps {
  contents: Content[];
  onCardClick: (id: string) => void;
}

const Container = styled.div`
  padding: 0 2rem 6rem;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 24px 0 16px 0;
`;

const ContentItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ContentTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  line-height: 1.4;
`;

const ContentExcerpt = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ContentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #999;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Badge = styled.span<{ type: string }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  color: white;
  background-color: ${({ type }) => {
    switch (type) {
      case 'ARTICLE': return '#4CAF50';
      case 'VIDEO': return '#2196F3';
      case 'AUDIO': return '#FF9800';
      case 'PREMIUM': return '#FFD700';
      default: return '#9E9E9E';
    }
  }};
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  margin: 2rem 0;
`;

export const ContentList: React.FC<ContentListViewProps> = React.memo(({ contents, onCardClick }) => {
  if (contents.length === 0) {
    return (
      <Container>
        <SectionTitle>AI가 추천하는 우리가 더욱 가까워 지는 방법</SectionTitle>
        <EmptyMessage>아직 추천할 컨텐츠가 없습니다.</EmptyMessage>
      </Container>
    );
  }

  const getTypeLabel = (type: ContentType) => {
    switch (type) {
      case ContentType.ARTICLE: return '아티클';
      case ContentType.VIDEO: return '비디오';
      case ContentType.AUDIO: return '오디오';
      case ContentType.PREMIUM: return '프리미엄';
      default: return '기타';
    }
  };

  return (
    <Container>
      <SectionTitle>AI가 추천하는 우리가 더욱 가까워 지는 방법</SectionTitle>
      {contents.map((content) => (
        <ContentItem key={content.id} onClick={() => onCardClick(content.id)}>
          <BadgeContainer>
            <Badge type={content.type}>{getTypeLabel(content.type)}</Badge>
            {content.isPremium && <Badge type="PREMIUM">프리미엄</Badge>}
          </BadgeContainer>
          <ContentTitle>{content.title}</ContentTitle>
          <ContentExcerpt>
            {content.body.replace(/<[^>]*>/g, '').substring(0, 100)}...
          </ContentExcerpt>
          <ContentMeta>
            <MetaItem>
              <span>❤️</span>
              {content.likesCount || 0}
            </MetaItem>
            <MetaItem>
              <span>📅</span>
              {new Date(content.createdAt).toLocaleDateString('ko-KR')}
            </MetaItem>
          </ContentMeta>
        </ContentItem>
      ))}
    </Container>
  );
}); 