import React from 'react';
import styled from 'styled-components';
import BackButton from '../common/BackButton';
import { formatInKST } from '../../utils/date';

interface ContentDetailProps {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
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

export const ContentDetail: React.FC<ContentDetailProps> = ({
  title,
  body,
  createdAt,
  onBack,
}) => {
  return (
    <Container>
      <Header>
        {onBack && <BackButton onClick={onBack} />}
        <Title>{title}</Title>
        <MetaInfo>
          <DateText>{formatInKST(createdAt, 'yyyy.MM.dd')}</DateText>
        </MetaInfo>
      </Header>
      <ContentBody dangerouslySetInnerHTML={{ __html: body }} />
    </Container>
  );
}; 