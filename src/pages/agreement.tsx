import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import AgreementList, { Agreement } from '../components/agreement/AgreementList';
import AgreementModal from '../components/agreement/AgreementModal';
import NavigationBar from '../components/NavigationBar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Container = styled.div`
  background-color: white;
  min-height: 100vh;
  padding: 2rem;
  padding-bottom: 70px; /* NavigationBar 높이만큼 패딩 */
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #4A4A4A;
  margin-bottom: 1.5rem;
  text-align: center;
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

const sampleAgreements: Agreement[] = [
  {
    id: 'sample1',
    title: '🗣 감정 표현 방식',
    content: '매주 일요일 저녁, 30분간 감정 공유 시간을 갖기로 함',
    date: '2025년 7월 2일',
    partnerName: '이몽룡',
  },
  {
    id: 'sample2',
    title: '📱 휴대폰 사용 규칙',
    content: '저녁 9시 이후에는 침실에서 핸드폰 사용 자제하기',
    date: '2025년 6월 17일',
    partnerName: '김지은',
  },
];

const AgreementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreements, setAgreements] = useState<Agreement[]>([]); // 실제 작성 리스트는 비워둠
  const [previewAgreement, setPreviewAgreement] = useState<Agreement | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  // TODO: 실제 로그인 유저/파트너 정보로 대체
  const myName = '홍길동';
  const partnerName = '이몽룡';

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
      pdf.save('agreement-sample.pdf');
    }, 300); // 모달 렌더링 후 캡처
  };

  return (
    <>
      <Container>
        <Title>우리의 합의서</Title>
        <button
          style={{
            display: 'block',
            margin: '1.5rem auto 2rem',
            background: '#4a6cf7',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.8rem 2.2rem',
            fontWeight: 600,
            fontSize: '1.08rem',
            cursor: 'pointer',
          }}
          onClick={() => setIsModalOpen(true)}
        >
          ✍️ 합의서 작성하기
        </button>
        <AgreementList agreements={agreements} onView={() => {}} onDownload={() => {}} />

        {/* 샘플 리스트 */}
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ textAlign: 'center', color: '#333', marginBottom: 16 }}>샘플 합의서 리스트</h3>
          {sampleAgreements.map((agreement) => (
            <div key={agreement.id} style={{ background: '#f8f9fc', borderRadius: 8, padding: '1.2rem', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#222' }}>{agreement.title}</div>
              <div style={{ color: '#555', marginTop: '0.5rem' }}>{agreement.content}</div>
              <div style={{ fontSize: '0.95rem', color: '#888', marginTop: '0.7rem' }}>
                ✔️ 합의일: {agreement.date} | 동의자: {agreement.partnerName}
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.7rem' }}>
                <button
                  style={{ padding: '0.5rem 0.8rem', fontSize: '0.9rem', borderRadius: 6, border: 'none', background: '#4a6cf7', color: 'white', cursor: 'pointer' }}
                  onClick={() => setPreviewAgreement(agreement)}
                >
                  📖 미리보기
                </button>
                <button
                  style={{ padding: '0.5rem 0.8rem', fontSize: '0.9rem', borderRadius: 6, border: 'none', background: '#e0e0e0', color: '#333', cursor: 'pointer' }}
                  onClick={() => handleDownloadPdf(agreement)}
                >
                  📥 PDF로 저장
                </button>
              </div>
            </div>
          ))}
        </div>

        <AgreementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={(newAgreement) => {
            setAgreements([newAgreement, ...agreements]);
            setIsModalOpen(false);
          }}
          myName={myName}
          partnerName={partnerName}
        />
        {/* 샘플 미리보기 모달 (PDF 캡처용 ref 연결) */}
        {previewAgreement && (
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setPreviewAgreement(null)}>
            <PreviewModalBox ref={pdfRef} onClick={e => e.stopPropagation()}>
              <h2 style={{ textAlign: 'center', color: '#333' }}>🤝 공동 약속서</h2>
              <div style={{ marginTop: '2rem' }}>
                <div style={{ fontWeight: 'bold', color: '#444', marginBottom: '0.3rem' }}>약속 주제</div>
                <div style={{ padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333' }}>{previewAgreement.title}</div>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <div style={{ fontWeight: 'bold', color: '#444', marginBottom: '0.3rem' }}>약속 내용</div>
                <div style={{ padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333' }}>{previewAgreement.content}</div>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <div style={{ fontWeight: 'bold', color: '#444', marginBottom: '0.3rem' }}>시작일</div>
                <div style={{ padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333' }}>{previewAgreement.date}</div>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <div style={{ fontWeight: 'bold', color: '#444', marginBottom: '0.3rem' }}>작성자</div>
                <div style={{ padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333' }}>홍길동 (ID: hk2024)</div>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <div style={{ fontWeight: 'bold', color: '#444', marginBottom: '0.3rem' }}>동의자</div>
                <div style={{ padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333' }}>{previewAgreement.partnerName} (ID: moonlee92)</div>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <div style={{ fontWeight: 'bold', color: '#444', marginBottom: '0.3rem' }}>작성일 및 서명시간</div>
                <div style={{ padding: '0.8rem 1rem', background: '#f1f3f6', borderRadius: 6, color: '#333' }}>{new Date().toLocaleString('ko-KR')} (KST)</div>
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#777', marginTop: '2rem' }}>
                * 본 문서는 리커넥트 앱 내 사용자 간 심리적 합의 기록용으로 작성되었습니다.
              </div>
            </PreviewModalBox>
          </div>
        )}
      </Container>
      <NavigationBar />
    </>
  );
};

export default AgreementPage;
