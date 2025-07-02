import React, { useState } from 'react';
import styled from 'styled-components';
import { Agreement } from './AgreementList';

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (agreement: Agreement) => void;
  myName: string;
  partnerName?: string;
  myId?: string;
  partnerId?: string;
}

const Overlay = styled.div`
  position: fixed;
  left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.25);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 95vw;
  max-width: 700px;
  max-height: calc(90vh - 70px);
  padding-bottom: 90px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.12);
  display: flex;
  gap: 2rem;
  overflow-y: auto;
  @media (max-width: 700px) {
    flex-direction: column;
    min-width: 0;
    padding: 1rem;
    gap: 1rem;
    max-width: 98vw;
    max-height: calc(98vh - 70px);
    padding-bottom: 90px;
  }
`;

const PdfBox = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 350px;
  min-width: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  flex: 1;
  @media (max-width: 700px) {
    padding: 1rem;
    max-width: 100%;
  }
`;

const Section = styled.div`
  margin-top: 1.3rem;
`;
const Label = styled.div`
  font-weight: bold;
  color: #444;
  margin-bottom: 0.3rem;
`;
const Value = styled.div`
  padding: 0.8rem 1rem;
  background: #f1f3f6;
  border-radius: 6px;
  color: #333;
`;
const Footer = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: #777;
  margin-top: 2rem;
`;
const FormBox = styled.form`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  @media (max-width: 700px) {
    min-width: 0;
  }
`;
const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  margin-top: 4px;
`;
const Textarea = styled.textarea`
  width: 100%;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  margin-top: 4px;
  min-height: 70px;
`;
const BtnRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 1.2rem;
`;
const Btn = styled.button<{primary?: boolean}>`
  flex: 1;
  background: ${p => p.primary ? '#4a6cf7' : '#eee'};
  color: ${p => p.primary ? 'white' : '#333'};
  border: none;
  border-radius: 8px;
  padding: 0.7rem 0;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
`;

const AgreementModal: React.FC<AgreementModalProps> = ({ isOpen, onClose, onCreate, myName, partnerName, myId, partnerId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');

  const now = new Date();
  const nowStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} (KST)`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !date) return;
    onCreate({
      id: Date.now().toString(),
      title,
      content,
      date,
      partnerName: partnerName || '-',
    });
    setTitle('');
    setContent('');
    setDate('');
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalBox>
        <PdfBox>
          <h2 style={{ textAlign: 'center', color: '#333' }}>🤝 공동 약속서</h2>
          <Section>
            <Label>약속 주제</Label>
            <Value>{title || '약속 주제를 입력하세요'}</Value>
          </Section>
          <Section>
            <Label>약속 내용</Label>
            <Value>{content || '약속 내용을 입력하세요'}</Value>
          </Section>
          <Section>
            <Label>시작일</Label>
            <Value>{date ? date.replace(/-/g, '년 ').replace(/(\d{2})$/, '$1일') : 'YYYY-MM-DD'}</Value>
          </Section>
          <Section>
            <Label>작성자</Label>
            <Value>{myName}{myId ? ` (ID: ${myId})` : ''}</Value>
          </Section>
          <Section>
            <Label>동의자</Label>
            <Value>{partnerName || '파트너 없음'}{partnerId ? ` (ID: ${partnerId})` : ''}</Value>
          </Section>
          <Section>
            <Label>작성일 및 서명시간</Label>
            <Value>{nowStr}</Value>
          </Section>
          <Footer>* 본 문서는 리커넥트 앱 내 사용자 간 심리적 합의 기록용으로 작성되었습니다.</Footer>
        </PdfBox>
        <FormBox onSubmit={handleSubmit}>
          <div>
            <Label>약속 주제</Label>
            <Input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예: 감정 표현 방식"
              required
            />
          </div>
          <div>
            <Label>약속 내용</Label>
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="약속 내용을 입력하세요"
              required
            />
          </div>
          <div>
            <Label>시작일</Label>
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
          <BtnRow>
            <Btn primary type="submit">저장</Btn>
            <Btn type="button" onClick={onClose}>취소</Btn>
          </BtnRow>
        </FormBox>
      </ModalBox>
    </Overlay>
  );
};

export default AgreementModal; 