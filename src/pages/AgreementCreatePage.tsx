import React, { useState } from 'react';
import styled from 'styled-components';
import DigitalSignature from '../components/agreement/DigitalSignature';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Container = styled.div`
  background: #fff;
  min-height: 100vh;
  padding: 2.5rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const PreviewModalBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 350px;
  max-width: 95vw;
  box-shadow: 0 2px 16px rgba(0,0,0,0.12);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  z-index: 2000;
`;

const AgreementCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const myName = user?.nickname || '';
  const partnerName = user?.partner?.nickname || '';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [condition, setCondition] = useState('');
  const [author, setAuthor] = useState(myName);
  const [partner, setPartner] = useState(partnerName);
  const [authorSignature, setAuthorSignature] = useState('');
  const [authorSignatureHash, setAuthorSignatureHash] = useState('');

  // 현재 날짜시간 (YYYY-MM-DD HH:mm)
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const nowStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())} (KST)`;

  // 간단한 해시 함수
//   const simpleHash = (str: string): string => {
//     let hash = 0;
//     if (str.length === 0) return hash.toString();
//     for (let i = 0; i < str.length; i++) {
//       const char = str.charCodeAt(i);
//       hash = ((hash << 5) - hash) + char;
//       hash = hash & hash;
//     }
//     return Math.abs(hash).toString(16);
//   };

  const [previewAgreement, setPreviewAgreement] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !condition || !author || !partner || !authorSignature) return;
    // 합의서 객체 생성
    const agreement = {
      title,
      content,
      condition,
      author,
      partner,
      authorSignature,
      authorSignatureHash,
      date: nowStr,
    };
    setPreviewAgreement(agreement);
    setIsPreviewOpen(true);
  };

  return (
    <Container>
      
        <h2 style={{ textAlign: 'center', color: '#333' }}>리커넥트 인증 합의서 작성</h2>
        <form style={{ width: '100%' }} onSubmit={handleSubmit}>
          <div className="section" style={{ marginTop: '2rem' }}>
            <div className="label" style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>제목</div>
            <input className="value" style={{ width: '100%', padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333', border: 'none', marginBottom: 0 }}
              type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="합의할 약속의 제목을 입력하세요" required />
          </div>

          <div className="section" style={{ marginTop: '2rem' }}>
            <div className="label" style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>내용</div>
            <textarea className="value" style={{ width: '100%', padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333', border: 'none', minHeight: 70 }}
              value={content} onChange={e => setContent(e.target.value)} placeholder="약속 내용을 입력하세요" required />
          </div>

          <div className="section" style={{ marginTop: '2rem' }}>
            <div className="label" style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>미 이행시 조건</div>
            <input className="value" style={{ width: '100%', padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333', border: 'none', marginBottom: 0 }}
              type="text" value={condition} onChange={e => setCondition(e.target.value)} placeholder="미이행시 조건을 입력하세요" required />
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
          {/* <div className="section" style={{ marginTop: '2rem' }}>
            <div className="label" style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>동의자 서명</div>
            <DigitalSignature
              onSignatureChange={(signature, hash) => {
                setPartnerSignature(signature);
                setPartnerSignatureHash(hash);
              }}
              placeholder={`${partner || '동의자'} 서명`}
            />
          </div> */}

          <div className="section" style={{ marginTop: '2rem' }}>
            <div className="label" style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>작성일 및 서명시간</div>
            <div className="value" style={{ width: '100%', padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333', border: 'none' }}>{nowStr}</div>
          </div>

          <div className="footer" style={{ textAlign: 'center', fontSize: '0.9rem', color: '#777', marginTop: '2rem' }}>
            * 본 문서는 리커넥트 앱 내 사용자 간 심리적 합의 기록용으로 작성되었습니다.
          </div>

          <BtnRow>
            <Btn type="button" onClick={() => navigate(-1)}>취소</Btn>
            <Btn $primary type="submit">합의서 전송</Btn>
          </BtnRow>
        </form>

        {isPreviewOpen && previewAgreement && (
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsPreviewOpen(false)}>
            <PreviewModalBox onClick={e => e.stopPropagation()}>
              <h2 style={{ textAlign: 'center', color: '#333' }}>합의서 미리보기</h2>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>제목</div>
                <div style={{ padding: '0.7rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333' }}>{previewAgreement.title}</div>
              </div>
              <div style={{ marginTop: '1.2rem' }}>
                <div style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>약속 내용</div>
                <div style={{ padding: '0.7rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333' }}>{previewAgreement.content}</div>
              </div>
              <div style={{ marginTop: '1.2rem' }}>
                <div style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>미이행시 조건</div>
                <div style={{ padding: '0.7rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333' }}>{previewAgreement.condition}</div>
              </div>
              <div style={{ marginTop: '1.2rem' }}>
                <div style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>작성자</div>
                <div style={{ padding: '0.7rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333' }}>{previewAgreement.author}</div>
              </div>
              <div style={{ marginTop: '1.2rem' }}>
                <div style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>동의자</div>
                <div style={{ padding: '0.7rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333' }}>{previewAgreement.partner}</div>
              </div>
              <div style={{ marginTop: '1.2rem' }}>
                <div style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>작성자 서명</div>
                {previewAgreement.authorSignature ? (
                  <img src={previewAgreement.authorSignature} alt="작성자 서명" style={{ width: '100%', height: '60px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: 4 }} />
                ) : (
                  <div style={{ color: '#aaa', fontSize: '0.95rem' }}>서명 없음</div>
                )}
              </div>
              <div style={{ marginTop: '1.2rem' }}>
                <div style={{ fontWeight: 'bold', color: '#444', marginBottom: 4 }}>작성일 및 서명시간</div>
                <div style={{ padding: '0.7rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333' }}>{previewAgreement.date}</div>
              </div>
              <BtnRow>
                <Btn type="button" onClick={() => setIsPreviewOpen(false)}>닫기</Btn>
                {/* 실제 전송 로직이 필요하다면 여기에 추가 */}
              </BtnRow>
            </PreviewModalBox>
          </div>
        )}
    </Container>
  );
};

export default AgreementCreatePage; 