import React, { useState } from 'react';
import styled from 'styled-components';
import { Agreement } from './AgreementList';

interface IssuedAgreementsProps {
  agreements: Agreement[];
  onView: (agreement: Agreement) => void;
  onDownload: (agreement: Agreement) => void;
}

const Container = styled.div`
  margin-bottom: 2.5rem;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  color: #ff69b4;
  margin-bottom: 0.7rem;
`;

const Description = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const Card = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1.2rem;
  position: relative;
`;

const StatusBadge = styled.div`
  position: absolute;
  right: 0;
  top: -0.5rem;
  width: 120px;
  padding: 0.35em 1em;
  border-radius: 1.2em;
  font-size: 0.92rem;
  font-weight: 700;
  background: #ff69b4;
  color: #fff;
  text-align: center;
`;

const TitleText = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Content = styled.div`
  color: #555;
  margin-top: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
`;

const Meta = styled.div`
  font-size: 0.88rem;
  color: #888;
  margin-top: 0.7rem;
`;

const Actions = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.7rem;
`;

const Btn = styled.button<{primary?: boolean, pink?: boolean}>`
  padding: 0.5rem 0.8rem;
  font-size: 0.9rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: ${({ primary, pink }) =>
    pink ? '#ff69b4' : primary ? '#785cd2' : '#e0e0e0'};
  color: ${({ primary, pink }) =>
    (primary || pink) ? 'white' : '#333'};
  font-weight: 600;
`;

const EmptyState = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  text-align: center;
  color: #666;
`;

const EmptyTitle = styled.div`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.div`
  font-size: 0.85rem;
  color: #888;
`;

const SortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

const SortButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  border: 1px solid ${props => props.$active ? '#ff69b4' : '#ddd'};
  background: ${props => props.$active ? '#ff69b4' : 'white'};
  color: ${props => props.$active ? 'white' : '#666'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: ${props => props.$active ? '600' : '400'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#ff69b4' : '#f8f9fa'};
    border-color: ${props => props.$active ? '#ff69b4' : '#ccc'};
  }
`;

const IssuedAgreements: React.FC<IssuedAgreementsProps> = ({ 
  agreements, 
  onView, 
  onDownload 
}) => {
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const issuedAgreements = agreements.filter(a => a.status === 'issued');

  // 합의서 정렬 함수
  const sortAgreements = (agreements: Agreement[]) => {
    return [...agreements].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      
      if (sortOrder === 'latest') {
        return dateB.getTime() - dateA.getTime(); // 최신순
      } else {
        return dateA.getTime() - dateB.getTime(); // 오래된순
      }
    });
  };

  return (
    <Container>
      <Title>발행 합의서 보관함</Title>
      <Description>
        합의서를 PDF로 발행하면 이곳에 보관됩니다. 발행된 합의서는 수정 및 위/변조가 불가능한 증명 문서로 보관됩니다.
      </Description>
      
      {issuedAgreements.length > 0 ? (
        <>
          {/* 정렬 버튼 */}
          <SortContainer>
            <SortButton 
              $active={sortOrder === 'latest'} 
              onClick={() => setSortOrder('latest')}
            >
              최신순
            </SortButton>
            <SortButton 
              $active={sortOrder === 'oldest'} 
              onClick={() => setSortOrder('oldest')}
            >
              오래된순
            </SortButton>
          </SortContainer>
          
          {sortAgreements(issuedAgreements).map((agreement) => (
          <Card key={agreement.id}>
            <StatusBadge>발행됨</StatusBadge>
            <TitleText>{agreement.title}</TitleText>
            <Content>{agreement.content}</Content>
            <Meta>✔️ 합의일: {agreement.date} | 동의자: {agreement.partnerName}</Meta>
            <Actions>
              <Btn primary onClick={() => onView(agreement)}>확인하기</Btn>
              <Btn pink onClick={() => onDownload(agreement)}>PDF 재발행</Btn>
            </Actions>
          </Card>
        ))}
        </>
      ) : (
        <EmptyState>
          <EmptyTitle>📄 발행된 합의서가 없습니다</EmptyTitle>
          <EmptyDescription>
            합의서를 작성하고 서명 완료 후 PDF로 발행하면 이곳에 보관됩니다.
          </EmptyDescription>
        </EmptyState>
      )}
    </Container>
  );
};

export default IssuedAgreements; 