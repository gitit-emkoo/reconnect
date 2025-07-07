import React, { useState } from 'react';
import styled from 'styled-components';
import DigitalSignature from '../components/agreement/DigitalSignature';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { agreementApi } from '../api/agreement';

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
  width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  box-shadow: 0 2px 16px rgba(0,0,0,0.12);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  z-index: 2000;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e74c3c;
  padding: 1rem;
  background: #fdf2f2;
  border-radius: 8px;
  margin: 1rem 0;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const Section = styled.div`
  margin-top: 2rem;
`;

const Label = styled.div`
  font-weight: bold;
  color: #444;
  margin-bottom: 4px;
`;

const ValueInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  background: #f1f3f6;
  border-radius: 6px;
  color: #333;
  border: none;
  margin-bottom: 0;
`;

const ValueTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  background: #f1f3f6;
  border-radius: 6px;
  color: #333;
  border: none;
  min-height: 90px;
  margin-bottom: 0;
`;

const Footer = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: #777;
  margin-top: 2rem;
`;

const ModalTitle = styled.h2`
  text-align: center;
  color: #333;
`;

const ModalField = styled.div`
  margin-top: 1.2rem;
  flex:1;
  overflow-y: auto;
  min-height: 100px;
`;

const ModalLabel = styled.div`
  font-weight: bold;
  color: #444;
  margin-bottom: 4px;
`;

const ModalValue = styled.div`
  padding: 0.7rem 1rem;
  background: #f1f3f6;
  border-radius: 6px;
  color: #333;
`;

const SignatureImg = styled.img`
  width: 100%;
  height: 60px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SignatureNone = styled.div`
  color: #aaa;
  font-size: 0.95rem;
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


  // 상태 관리
  const [previewAgreement, setPreviewAgreement] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 현재 날짜시간 (YYYY-MM-DD HH:mm)
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const nowStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())} (KST)`;

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

  const handleCreateAgreement = async () => {
    if (!user?.partner?.id) {
      setError('파트너 정보가 없습니다.');
      return;
    }

    if (!authorSignature) {
      setError('작성자 서명이 필요합니다.');
      return;
    }



    try {
      setIsSubmitting(true);
      setError(null);

      const agreementData = {
        title,
        content,
        condition,
        partnerId: user.partner.id,
        authorSignature,
        coupleId: user.couple?.id,
      };

      await agreementApi.create(agreementData);
      
      // 성공 시 합의서 목록 페이지로 이동
      navigate('/agreement');
    } catch (err) {
      console.error('합의서 생성 실패:', err);
      setError('합의서 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>리커넥트 인증 합의서 작성</Title>
        <form style={{ width: '100%' }} onSubmit={handleSubmit}>
        <Section>
          <Label>제목</Label>
          <ValueInput type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="합의할 약속의 제목을 입력하세요" required />
        </Section>
        <Section>
          <Label>내용</Label>
          <ValueTextarea value={content} onChange={e => setContent(e.target.value)} placeholder="약속 내용을 입력하세요" required />
        </Section>
        <Section>
          <Label>미 이행시 조건</Label>
          <ValueTextarea value={condition} onChange={e => setCondition(e.target.value)} placeholder="미이행시 조건을 입력하세요" required />
        </Section>
        <Section>
          <Label>작성자</Label>
          <ValueInput type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="작성자 이름을 입력하세요" required />
        </Section>
        <Section>
          <Label>동의자</Label>
          <ValueInput type="text" value={partner} onChange={e => setPartner(e.target.value)} placeholder="동의자 이름을 입력하세요" required />
        </Section>
        <Section>
          <Label>작성자 서명</Label>
            <DigitalSignature
              onSignatureChange={(signature, hash) => {
                setAuthorSignature(signature);
                setAuthorSignatureHash(hash);
              }}
              placeholder={`${author || '작성자'} 서명`}
            />
        </Section>
        <Section>
          <Label>작성일 및 서명시간</Label>
          <ModalValue>{nowStr}</ModalValue>
        </Section>
        <Footer>
            * 본 문서는 리커넥트 앱 내 사용자 간 심리적 합의 기록용으로 작성되었습니다.
        </Footer>
          <BtnRow>
            <Btn type="button" onClick={() => navigate(-1)}>취소</Btn>
          <Btn $primary type="submit">합의서 미리보기</Btn>
          </BtnRow>
        </form>

        {isPreviewOpen && previewAgreement && (
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsPreviewOpen(false)}>
            <PreviewModalBox onClick={e => e.stopPropagation()}>
            <ModalTitle>합의서 미리보기</ModalTitle>
              {/* 에러 메시지 */}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ModalField>
              <ModalLabel>제목</ModalLabel>
              <ModalValue>{previewAgreement.title}</ModalValue>
            </ModalField>
            <ModalField>
              <ModalLabel>약속 내용</ModalLabel>
              <ModalValue>{previewAgreement.content}</ModalValue>
            </ModalField>
            <ModalField>
              <ModalLabel>조건</ModalLabel>
              <ModalValue>{previewAgreement.condition}</ModalValue>
            </ModalField>
            <ModalField>
              <ModalLabel>작성자</ModalLabel>
              <ModalValue>{previewAgreement.author}</ModalValue>
            </ModalField>
            <ModalField>
              <ModalLabel>동의자</ModalLabel>
              <ModalValue>{previewAgreement.partner}</ModalValue>
            </ModalField>
            <ModalField>
              <ModalLabel>작성자 서명</ModalLabel>
              {previewAgreement.authorSignature ? (
                <SignatureImg src={previewAgreement.authorSignature} alt="작성자 서명" />
              ) : (
                <SignatureNone>서명 없음</SignatureNone>
              )}
            </ModalField>
            <ModalField>
              <ModalLabel>작성일 및 서명시간</ModalLabel>
              <ModalValue>{previewAgreement.date}</ModalValue>
            </ModalField>
              <BtnRow>
                <Btn type="button" onClick={() => setIsPreviewOpen(false)} disabled={isSubmitting}>
                이전으로
                </Btn>
                <Btn $primary type="button" onClick={handleCreateAgreement} disabled={isSubmitting}>
                  {isSubmitting ? (
                  <LoadingSpinner>전송 중...</LoadingSpinner>
                  ) : (
                  '합의서 전송'
                  )}
                </Btn>
              </BtnRow>
            </PreviewModalBox>
          </div>
        )}
    </Container>
  );
};

export default AgreementCreatePage; 