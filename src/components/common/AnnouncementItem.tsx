import React, { useState } from 'react';
import styled from 'styled-components';

// FaqItem.tsx와 동일한 스타일 사용 또는 필요시 약간 수정
const ItemContainer = styled.div`
  border-bottom: 1px solid #eee;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.5rem;
  cursor: pointer;
  user-select: none;
`;

const TitleText = styled.p`
  font-size: 0.95rem;
  color: #333;
  margin: 0;
  font-weight: 500; // 제목은 약간 더 강조
`;

const ContentWrapper = styled.div<{ isOpen: boolean }>`
  padding: 0 0.5rem 1rem 0.5rem;
  font-size: 0.85rem;
  color: #555;
  line-height: 1.6;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
  display: ${props => (props.isOpen ? 'block' : 'none')};

  // 공지사항 내용에 p 태그 외 다양한 태그가 올 수 있으므로, 내부 스타일은 유연하게
  p, div, span {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  // 첫번째 요소의 상단 마진 제거
  *:first-child {
    margin-top: 0;
  }
`;

const ArrowIcon = styled.span<{ isOpen: boolean }>`
  font-size: 1rem;
  color: #777;
  transition: transform 0.2s ease-in-out;
  margin-left: 0.5rem;

  &::before {
    content: '${props => (props.isOpen ? '▾' : '▸')}';
    display: inline-block;
  }
`;

interface AnnouncementItemProps {
  title: string;
  date: string; // 공지사항 날짜 추가
  content: React.ReactNode; // HTML 내용을 포함할 수 있도록 ReactNode 타입 사용
}

const AnnouncementItem: React.FC<AnnouncementItemProps> = ({ title, date, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ItemContainer>
      <TitleWrapper onClick={toggleOpen}>
        <div>
          <TitleText>{title}</TitleText>
          <span style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>{date}</span>
        </div>
        <ArrowIcon isOpen={isOpen} />
      </TitleWrapper>
      <ContentWrapper isOpen={isOpen}>
        {/* ReactNode 타입이므로 content를 그대로 렌더링 */} 
        {content}
      </ContentWrapper>
    </ItemContainer>
  );
};

export default AnnouncementItem; 