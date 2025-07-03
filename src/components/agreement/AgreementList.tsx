import React from 'react';
import styled from 'styled-components';

export interface Agreement {
  id: string;
  title: string;
  content: string;
  date: string;
  partnerName: string;
  authorName?: string;
  // 디지털 서명 관련 필드 추가
  authorSignature?: string; // Base64 인코딩된 서명 이미지
  partnerSignature?: string; // Base64 인코딩된 서명 이미지
  authorSignatureHash?: string; // 서명 데이터 해시
  partnerSignatureHash?: string; // 서명 데이터 해시
  agreementHash?: string; // 전체 합의서 내용 해시
  qrCodeData?: string; // QR 코드에 포함될 데이터
  status?: string; // 합의서 상태
}

interface AgreementListProps {
  agreements: Agreement[];
  onView: (agreement: Agreement) => void;
  onDownload: (agreement: Agreement) => void;
}

const ListContainer = styled.div``;

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  margin-bottom: 1.2rem;
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: #222;
`;
const EmptySubText = styled.div`
  font-size: 0.88rem;
  color: #888;
  margin-top: 0.7rem;
`;

const Content = styled.div`
  color: #555;
  margin-top: 0.5rem;
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
const Btn = styled.button<{primary?: boolean}>`
  padding: 0.5rem 0.8rem;
  font-size: 0.9rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: ${p => p.primary ? '#785cd2' : '#e0e0e0'};
  color: ${p => p.primary ? 'white' : '#333'};
  font-weight: 600;
`;
const EmptyText = styled.div`
  text-align: center;
  color: #888;
  margin-top: 2rem;
`;
const Status = styled.div`
  font-size: 0.95rem;
  color: #785cd2;
  margin-top: 0.5rem;
  font-weight: 600;
`;

const AgreementList: React.FC<AgreementListProps> = ({ agreements, onView, onDownload }) => {
  return (
    <ListContainer>
      {agreements.length === 0 && (
        <EmptyText>
        아직 작성된 합의서가 없습니다.
        <EmptySubText>위의 "합의서 작성" 버튼을 눌러 첫 번째 합의서를 작성해보세요!</EmptySubText>
      </EmptyText>
      )}
      {agreements.map((agreement) => (
        <Card key={agreement.id}>
          <Title>{agreement.title}</Title>
          <Content>{agreement.content}</Content>
          <Meta>✔️ 합의일: {agreement.date} | 동의자: {agreement.partnerName}</Meta>
          <Status>
            {agreement.status === 'pending' && '파트너 서명 대기중'}
            {(agreement.status === 'signed' || agreement.status === 'completed') && '합의 완료'}
            {agreement.status === 'cancelled' && '취소됨'}
          </Status>
          <Actions>
            <Btn primary onClick={() => onView(agreement)}>확인하기</Btn>
            <Btn onClick={() => onDownload(agreement)}>PDF 저장</Btn>
          </Actions>
        </Card>
      ))}
    </ListContainer>
  );
};

export default AgreementList; 