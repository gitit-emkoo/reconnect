import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import AgreementList, { Agreement } from '../components/agreement/AgreementList';
import QRCodeGenerator from '../components/agreement/QRCodeGenerator';
import NavigationBar from '../components/NavigationBar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import BackButton  from '../components/common/BackButton';
import { agreementApi, Agreement as ApiAgreement } from '../api/agreement';

const Container = styled.div`
  background-color: white;
  min-height: 100vh;
  padding: 2rem;
  padding-bottom: 70px; 
`;

const PreviewModalBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 350px;
  height: 500px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.12);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;



const TopButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1.5rem auto 2rem;
`;

const TopButton = styled.button<{ $primary?: boolean }>`
  background: ${p => p.$primary ? '#785cd2' : '#28a745'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1.08rem;
  cursor: pointer;
`;


const ModalOverlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.25);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalTitle = styled.h2`
  text-align: center;
  color: #333;
`;

const ModalSection = styled.div`
  margin-top: 2rem;
`;

const ModalLabel = styled.div`
  font-weight: bold;
  color: #444;
  margin-bottom: 0.3rem;
`;

const ModalValue = styled.div`
  padding: 0.8rem 1rem;
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

const SignatureLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.3rem;
`;

const SignatureBox = styled.div`
  flex: 1;
  min-width: 120px;
`;

const ModalFooter = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: #777;
  margin-top: 2rem;
`;

const ModalHash = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
`;

const sampleAgreements: Agreement[] = [
  {
    id: 'sample1',
    title: '감정 표현 방식',
    content: '이번주 부터 매주 일요일 저녁, 30분간 감정 공유 시간을 갖기로 함함',
    date: '2025년 7월 2일',
    partnerName: '이몽룡',
  },
];

const AgreementPage: React.FC = () => {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState<ApiAgreement[]>([]);
  
  
  const [previewAgreement, setPreviewAgreement] = useState<Agreement | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const [showSample, setShowSample] = useState(false);

  // 합의서 목록 가져오기
  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        
        const data = await agreementApi.findMyAgreements();
        setAgreements(data);
        
      } catch (err: any) {
        // 네트워크 에러(404, 500 등)만 에러 메시지 표시
        if (err?.response && err.response.status >= 400) {
          
        } else {
          
        }
      } finally {
        
      }
    };

    fetchAgreements();
  }, []);

  // 샘플 PDF 다운로드
  const handleDownloadPdf = async (agreement: Agreement) => {
    setPreviewAgreement(agreement); // 미리보기 모달 띄움
    setTimeout(async () => {
      if (!pdfRef.current) return;
      const canvas = await html2canvas(pdfRef.current, { width: 350, height: 500, windowWidth: 350, windowHeight: 500 });
      const imgData = canvas.toDataURL('image/png');
      const widthPx = 350;
      const heightPx = 500;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [widthPx, heightPx] });
      pdf.addImage(imgData, 'PNG', 0, 0, widthPx, heightPx);
      // 파일명: reconnect_YYYYMMDD_HHmmss_커플아이디.pdf
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const dateStr = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      const coupleId = user?.couple?.id || 'samplecouple';
      pdf.save(`reconnect_${dateStr}_${coupleId}.pdf`);
    }, 300); // 모달 렌더링 후 캡처
  };

  // 실제 합의서를 Agreement 타입으로 변환
  const convertToAgreementType = (apiAgreement: ApiAgreement): Agreement => {
    return {
      id: apiAgreement.id,
      title: apiAgreement.title,
      content: apiAgreement.content,
      date: new Date(apiAgreement.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      partnerName: apiAgreement.partner.nickname,
      authorName: apiAgreement.author.nickname,
      authorSignature: apiAgreement.authorSignature,
      partnerSignature: apiAgreement.partnerSignature || undefined,
      agreementHash: apiAgreement.agreementHash || undefined,
      status: apiAgreement.status,
    };
  };

  const convertedAgreements = agreements.map(convertToAgreementType);

  return (
    <>
    <Header title="리커넥트 인증 합의서" />
    <BackButton />
      <Container>
        <TopButtonRow>
          <TopButton $primary onClick={() => navigate('/agreement/create')}>✒️ 합의서 작성</TopButton>
          <TopButton onClick={() => window.location.href = '/agreement-verification'}>🔐 합의서 인증</TopButton>
        </TopButtonRow>

        {/* 샘플 리스트 토글이 항상 위에 */}
        <div style={{ marginTop: '1.5rem' }}>
          <h3
            style={{ textAlign: 'center', color: '#333', marginBottom: 16, cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setShowSample(v => !v)}
          >
            합의서 샘플 보기 ▾
          </h3>
          {showSample && (
            <AgreementList
              agreements={sampleAgreements}
              onView={setPreviewAgreement}
              onDownload={handleDownloadPdf}
            />
          )}
        </div>

        {/* 실제 내 합의서 리스트는 항상 아래에 */}
        <AgreementList
          agreements={convertedAgreements}
          onView={setPreviewAgreement}
          onDownload={handleDownloadPdf}
        />


        {/* 샘플 미리보기 모달 (PDF 캡처용 ref 연결) */}
        {previewAgreement && (
          <ModalOverlay onClick={() => setPreviewAgreement(null)}>
            <PreviewModalBox ref={pdfRef} onClick={e => e.stopPropagation()}>
              <ModalTitle>공동 약속서</ModalTitle>
              <ModalSection>
                <ModalLabel>약속 주제</ModalLabel>
                <ModalValue>{previewAgreement.title}</ModalValue>
              </ModalSection>
              <ModalSection>
                <ModalLabel>약속 내용</ModalLabel>
                <ModalValue>{previewAgreement.content}</ModalValue>
              </ModalSection>
              <ModalSection>
                <ModalLabel>작성자</ModalLabel>
                <ModalValue>{previewAgreement.authorName} </ModalValue>
              </ModalSection>
              <ModalSection>
                <ModalLabel>동의자</ModalLabel>
                <ModalValue>{previewAgreement.partnerName} </ModalValue>
              </ModalSection>
              <ModalSection>
                <ModalLabel>작성일 및 서명시간</ModalLabel>
                <ModalValue>{previewAgreement.date}</ModalValue>
              </ModalSection>
              {/* 서명 섹션 */}
              {(previewAgreement.authorSignature || previewAgreement.partnerSignature) && (
                <ModalSection>
                  <ModalLabel>서명</ModalLabel>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {previewAgreement.authorSignature && (
                      <SignatureBox>
                        <SignatureLabel>작성자 서명</SignatureLabel>
                        <SignatureImg src={previewAgreement.authorSignature} alt="작성자 서명" />
                      </SignatureBox>
                    )}
                    {previewAgreement.partnerSignature && (
                      <SignatureBox>
                        <SignatureLabel>동의자 서명</SignatureLabel>
                        <SignatureImg src={previewAgreement.partnerSignature} alt="동의자 서명" />
                      </SignatureBox>
                    )}
                  </div>
                </ModalSection>
              )}
              {/* QR 인증 마크 */}
              {previewAgreement.agreementHash && (
                <ModalSection style={{ textAlign: 'center' }}>
                  <QRCodeGenerator 
                    agreement={previewAgreement} 
                    size={100} 
                    showVerificationInfo={false}
                  />
                </ModalSection>
              )}
              <ModalFooter>
                * 본 문서는 리커넥트 앱 내 사용자 간 심리적 합의 기록용으로 작성되었습니다.
                {previewAgreement.agreementHash && (
                  <ModalHash>
                    인증 해시: {previewAgreement.agreementHash.substring(0, 8)}...
                  </ModalHash>
                )}
              </ModalFooter>
            </PreviewModalBox>
          </ModalOverlay>
        )}
      </Container>
      <NavigationBar />
    </>
  );
};

export default AgreementPage;

