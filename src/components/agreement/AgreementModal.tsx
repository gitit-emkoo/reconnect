import React, { useState } from 'react';
import styled from 'styled-components';
import { Agreement } from './AgreementList';
import DigitalSignature from './DigitalSignature';

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (agreement: Agreement) => void;
  myName: string;
  partnerName?: string;
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

const BtnRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 1.2rem;
`;
const Btn = styled.button<{ $primary?: boolean }>`
  flex: 1;
  background: ${p => p.$primary ? '#785cd2' : '#eee'};
  color: ${p => p.$primary ? 'white' : '#333'};
  border: none;
  border-radius: 8px;
  padding: 0.7rem 0;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
`;

const AgreementModal: React.FC<AgreementModalProps> = ({ isOpen, onClose, onCreate, myName, partnerName }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(myName || '');
  const [partner, setPartner] = useState(partnerName || '');
  const [authorSignature, setAuthorSignature] = useState('');
  const [authorSignatureHash, setAuthorSignatureHash] = useState('');
  const [partnerSignature, setPartnerSignature] = useState('');
  const [partnerSignatureHash, setPartnerSignatureHash] = useState('');

  // 현재 날짜시간 (YYYY-MM-DD HH:mm)
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const nowStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())} (KST)`;

  // 간단한 해시 함수
  const simpleHash = (str: string): string => {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !author || !partner) return;
    
    // 합의서 전체 내용의 해시 생성
    const agreementContent = `${title}${content}${author}${partner}${nowStr}`;
    const agreementHash = simpleHash(agreementContent);
    
    onCreate({
      id: Date.now().toString(),
      title,
      content,
      date: nowStr,
      partnerName: partner,
      authorName: author,
      authorSignature,
      authorSignatureHash,
      partnerSignature,
      partnerSignatureHash,
      agreementHash,
      qrCodeData: JSON.stringify({
        agreementId: Date.now().toString(),
        title,
        date: nowStr,
        authorName: author,
        partnerName: partner,
        agreementHash
      })
    });
    
    // 폼 초기화
    setTitle('');
    setContent('');
    setAuthor(myName || '');
    setPartner(partnerName || '');
    setAuthorSignature('');
    setAuthorSignatureHash('');
    setPartnerSignature('');
    setPartnerSignatureHash('');
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalBox style={{ maxWidth: 700, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
        <form style={{ width: '100%' }} onSubmit={handleSubmit}>
          <h2 style={{ textAlign: 'center', color: '#333' }}>리커넥트 인증 합의서</h2>

          <div className="section" style={{ marginTop: '2rem' }}>
            <div className="label" style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>제목</div>
            <input className="value" style={{ width: '100%', padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333', border: 'none', marginBottom: 0 }}
              type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="합의할 약속의 제목을 입력하세요" required />
          </div>

          <div className="section" style={{ marginTop: '2rem' }}>
            <div className="label" style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>약속 내용</div>
            <textarea className="value" style={{ width: '100%', padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333', border: 'none', minHeight: 70 }}
              value={content} onChange={e => setContent(e.target.value)} placeholder="약속 내용을 입력하세요" required />
          </div>

          <div className="section" style={{ marginTop: '2rem' }}>
            <div className="label" style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>미 이행시 조건</div>
            <input className="value" style={{ width: '100%', padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333', border: 'none', marginBottom: 0 }}
              type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="미 이행시 조건을 조건을 입력하세요" required />
          </div>

          <div className="section" style={{ marginTop: '2rem' }}>
            <div className="label" style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>작성자</div>
            <input className="value" style={{ width: '100%', padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333', border: 'none' }}
              type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="작성자 이름을 입력하세요" required />
          </div>

          <div className="section" style={{ marginTop: '2rem' }}>
            <div className="label" style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>동의자</div>
            <input className="value" style={{ width: '100%', padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333', border: 'none' }}
              type="text" value={partner} onChange={e => setPartner(e.target.value)} placeholder="동의자 이름을 입력하세요" required />
          </div>

          {/* 작성자 서명 */}
          <div className="section" style={{ marginTop: '2rem' }}>
            <div className="label" style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>작성자 서명</div>
            <DigitalSignature
              onSignatureChange={(signature, hash) => {
                setAuthorSignature(signature);
                setAuthorSignatureHash(hash);
              }}
              placeholder={`${author || '작성자'} 서명`}
            />
          </div>

          {/* 동의자 서명 이건 뺴야함*/}
          <div className="section" style={{ marginTop: '2rem' }}>
            <div className="label" style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>동의자 서명</div>
            <DigitalSignature
              onSignatureChange={(signature, hash) => {
                setPartnerSignature(signature);
                setPartnerSignatureHash(hash);
              }}
              placeholder={`${partner || '동의자'} 서명`}
            />
          </div>

          <div className="section" style={{ marginTop: '2rem' }}>
            <div className="label" style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>작성일 및 서명시간</div>
            <div className="value" style={{ width: '100%', padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333', border: 'none' }}>{nowStr}</div>
          </div>

          <div className="footer" style={{ textAlign: 'center', fontSize: '0.9rem', color: '#777', marginTop: '2rem' }}>
            * 본 문서는 리커넥트 앱 내 사용자 간 심리적 합의 기록용으로 작성되었습니다.
          </div>

          <BtnRow>
            <Btn $primary type="submit">작성완료</Btn>
            <Btn type="button" onClick={onClose}>취소</Btn>
          </BtnRow>
        </form>
      </ModalBox>
    </Overlay>
  );
};

export default AgreementModal; 