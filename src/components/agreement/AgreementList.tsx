import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import useAuthStore from '../../store/authStore';
import { agreementApi } from '../../api/agreement';
import QRCodeGenerator from './QRCodeGenerator';
import DigitalSignature from './DigitalSignature';
import ConfirmationModal from '../common/ConfirmationModal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface Agreement {
  id: string;
  title: string;
  content: string;
  condition?: string; // 미이행시 조건
  date: string;
  partnerName: string;
  authorName?: string;
  authorId?: string; // 작성자 ID 추가
  partnerId?: string; // 파트너 ID 추가
  // 디지털 서명 관련 필드 추가
  authorSignature?: string; // Base64 인코딩된 서명 이미지
  partnerSignature?: string; // Base64 인코딩된 서명 이미지
  authorSignatureHash?: string; // 서명 데이터 해시
  partnerSignatureHash?: string; // 서명 데이터 해시
  agreementHash?: string; // 전체 합의서 내용 해시
  qrCodeData?: string; // QR 코드에 포함될 데이터
  status?: string; // 합의서 상태
  isSample?: boolean; // 샘플 합의서 여부
}


const ListContainer = styled.div``;

const Card = styled.div<{ $sample?: boolean }>`
  background: ${props => props.$sample ? '#f5f6fa' : 'white'};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  margin-bottom: 1.2rem;
  position: relative;
`;

const StatusBadge = styled.div<{ $color?: string }>`
  position: absolute;
  top: -0.5rem;
  right: 1.2rem;
  padding: 0.35em 1em;
  border-radius: 1.2em;
  font-size: 0.92rem;
  font-weight: 700;
  background: ${props => props.$color || '#eee'};
  color: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  letter-spacing: 0.01em;
  z-index: 2;
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

const AgreementList: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [previewAgreement, setPreviewAgreement] = useState<Agreement | null>(null);
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [pdfTimestamp, setPdfTimestamp] = useState<string | null>(null);
  const [partnerSignature, setPartnerSignature] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [showPdfConfirmModal, setShowPdfConfirmModal] = useState(false);
  const [pendingPdfAgreement, setPendingPdfAgreement] = useState<Agreement | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  // 실제 합의서 목록 불러오기
  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const data = await agreementApi.findMyAgreements();
        const converted = data.map(apiAgreement => ({
          id: apiAgreement.id,
          title: apiAgreement.title,
          content: apiAgreement.content,
          condition: apiAgreement.condition,
          date: new Date(apiAgreement.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          partnerName: apiAgreement.partner.nickname,
          authorName: apiAgreement.author.nickname,
          authorId: apiAgreement.author.id,
          partnerId: apiAgreement.partner.id,
          authorSignature: apiAgreement.authorSignature,
          partnerSignature: apiAgreement.partnerSignature || undefined,
          agreementHash: apiAgreement.agreementHash || undefined,
          status: apiAgreement.status,
        }));
        setAgreements(converted);
      } catch (err) {}
    };
    fetchAgreements();
  }, []);

  // PDF 전용 A4 컴포넌트
  const PdfAgreementA4 = ({ agreement }: { agreement: Agreement }) => (
    <div
      style={{
        width: 794,
        height: 1123,
        background: '#fff',
        padding: 24,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        transform: 'scale(0.92)',
        transformOrigin: 'top left',
        fontSize: 13,
        overflow: 'hidden',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#333', fontSize: 22, marginBottom: 14 }}>공동 약속서</h2>
      <div style={{ marginBottom: 10 }}><b>약속 주제</b><div style={{ background: '#f1f3f6', borderRadius: 6, padding: 8, marginTop: 3, fontSize: 13 }}>{agreement.title}</div></div>
      <div style={{ marginBottom: 10 }}><b>약속 내용</b><div style={{ background: '#f1f3f6', borderRadius: 6, padding: 8, marginTop: 3, fontSize: 13 }}>{agreement.content}</div></div>
      <div style={{ marginBottom: 10 }}><b>미이행시 조건</b><div style={{ background: '#f1f3f6', borderRadius: 6, padding: 8, marginTop: 3, fontSize: 13 }}>{agreement.condition}</div></div>
      <div style={{ marginBottom: 10 }}><b>작성자</b><div style={{ background: '#f1f3f6', borderRadius: 6, padding: 8, marginTop: 3, fontSize: 13 }}>{agreement.authorName}</div></div>
      <div style={{ marginBottom: 10 }}><b>동의자</b><div style={{ background: '#f1f3f6', borderRadius: 6, padding: 8, marginTop: 3, fontSize: 13 }}>{agreement.partnerName}</div></div>
      <div style={{ marginBottom: 10 }}><b>작성일 및 서명시간</b><div style={{ background: '#f1f3f6', borderRadius: 6, padding: 8, marginTop: 3, fontSize: 13 }}>{agreement.date}</div></div>
      <div style={{ marginBottom: 10, display: 'flex', gap: 16 }}>
        {agreement.authorSignature && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#666', marginBottom: 3 }}>작성자 서명</div>
            <img src={agreement.authorSignature} alt="작성자 서명" style={{ width: '100%', height: 40, objectFit: 'contain', border: '1px solid #ddd', borderRadius: 4 }} />
          </div>
        )}
        {agreement.partnerSignature && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#666', marginBottom: 3 }}>동의자 서명</div>
            <img src={agreement.partnerSignature} alt="동의자 서명" style={{ width: '100%', height: 40, objectFit: 'contain', border: '1px solid #ddd', borderRadius: 4 }} />
          </div>
        )}
      </div>
      {/* 합의서 ID를 서명 아래, QR코드 위에 위치 */}
      {agreement.status === 'completed' && (
        <>
          <div style={{ marginTop: 16, color: '#888', fontSize: 12, textAlign: 'center', wordBreak: 'break-all' }}>
            합의서 ID: {agreement.id}
          </div>
          <div style={{
            textAlign: 'center',
            marginTop: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            minWidth: 220,
          }}>
            <div style={{
              fontWeight: 600,
              fontSize: 15,
              marginBottom: 6,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <span role="img" aria-label="lock">🔒</span> 리커넥트 인증 QR코드
            </div>
            <div style={{
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              padding: 8,
              marginBottom: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 113,
              height: 113,
            }}>
              <QRCodeGenerator agreement={agreement} size={113} showVerificationInfo={false} />
            </div>
            <div style={{ marginTop: 6, color: '#888', fontSize: 13 }}>
              ※ 이 합의서는 리커넥트에서 발급된 공식 문서입니다.
            </div>
            {pdfTimestamp && (
              <div style={{ marginTop: 4, color: '#aaa', fontSize: 12 }}>
                PDF 생성일시: {pdfTimestamp}
              </div>
            )}
            {agreement.agreementHash && (
              <div style={{
                marginTop: 4,
                color: '#888',
                fontSize: 12,
                wordBreak: 'break-all',
                letterSpacing: '0.02em'
              }}>
                고유 식별값: {agreement.agreementHash}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  // PDF 저장 확인 모달 표시
  const handlePdfButtonClick = (agreement: Agreement) => {
    setPendingPdfAgreement(agreement);
    setShowPdfConfirmModal(true);
  };

  // PDF 저장 함수
  const handleDownloadPdf = async () => {
    if (!pendingPdfAgreement) return;
    
    setIsPdfMode(true);
    setPreviewAgreement(pendingPdfAgreement);
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    setPdfTimestamp(timestamp);
    setTimeout(async () => {
      if (!pdfRef.current) return;
      const canvas = await html2canvas(pdfRef.current, { width: 794, height: 1123, scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [794, 1123] });
      pdf.addImage(imgData, 'PNG', 0, 0, 794, 1123);
      const dateStr = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      const coupleId = user?.couple?.id || 'samplecouple';
      pdf.save(`reconnect_${dateStr}_${coupleId}.pdf`);
      setIsPdfMode(false);
      setPdfTimestamp(null);
      setShowPdfConfirmModal(false);
      setPendingPdfAgreement(null);
    }, 300);
  };

  // 서명 처리 함수
  const handleSignAgreement = async () => {
    if (!previewAgreement || !partnerSignature) {
      return;
    }
    try {
      setIsSigning(true);
      await agreementApi.signAgreement(previewAgreement.id, {
        signature: partnerSignature,
        signedAt: new Date().toISOString(),
      });
      // 성공 시 합의서 목록 새로고침
      const updated = await agreementApi.findMyAgreements();
      const converted = updated.map(apiAgreement => ({
        id: apiAgreement.id,
        title: apiAgreement.title,
        content: apiAgreement.content,
        condition: apiAgreement.condition,
        date: new Date(apiAgreement.createdAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        partnerName: apiAgreement.partner.nickname,
        authorName: apiAgreement.author.nickname,
        authorId: apiAgreement.author.id,
        partnerId: apiAgreement.partner.id,
        authorSignature: apiAgreement.authorSignature,
        partnerSignature: apiAgreement.partnerSignature || undefined,
        agreementHash: apiAgreement.agreementHash || undefined,
        status: apiAgreement.status,
      }));
      setAgreements(converted);
      setPreviewAgreement(null);
      setPartnerSignature('');
    } catch (err) {
      // 서명 실패 시 에러 처리 (필요시 alert 또는 다른 방식으로 처리)
    } finally {
      setIsSigning(false);
    }
  };

  // 현재 사용자가 파트너이고 아직 서명하지 않은지 확인
  const canSignAsPartner = (agreement: Agreement) => {
    return (
      user?.id === agreement.partnerId &&
      !agreement.partnerSignature &&
      agreement.status === 'pending'
    );
  };

  return (
    <>
      {/* 실제 내 합의서 리스트만 렌더링 */}
      <AgreementListInner
        agreements={agreements}
        isSample={false}
        onView={setPreviewAgreement}
        onDownload={handlePdfButtonClick}
      />
      {/* 미리보기 모달 */}
      {previewAgreement && !isPdfMode && (
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
              <ModalLabel>미이행시 조건</ModalLabel>
              <ModalValue>{previewAgreement.condition}</ModalValue>
            </ModalSection>
            <ModalSection>
              <ModalLabel>작성자</ModalLabel>
              <ModalValue>{previewAgreement.authorName}</ModalValue>
            </ModalSection>
            <ModalSection>
              <ModalLabel>동의자</ModalLabel>
              <ModalValue>{previewAgreement.partnerName}</ModalValue>
            </ModalSection>
            <ModalSection>
              <ModalLabel>작성일 및 서명시간</ModalLabel>
              <ModalValue>{previewAgreement.date}</ModalValue>
            </ModalSection>
            {/* 서명 섹션 */}
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
            {/* 파트너 서명 입력 섹션 */}
            {canSignAsPartner(previewAgreement) && (
              <ModalSection>
                <ModalLabel>동의자 서명</ModalLabel>
                <DigitalSignature
                  onSignatureChange={(signature) => {
                    setPartnerSignature(signature);
                  }}
                  placeholder={`${previewAgreement.partnerName} 서명`}
                />
              </ModalSection>
            )}
            <ModalFooter>
              * 본 문서는 리커넥트 앱 내 사용자 간 심리적 합의 기록용으로 작성되었습니다.
            </ModalFooter>
            {/* 버튼 섹션 */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                style={{
                  flex: 1,
                  padding: '0.7rem',
                  background: '#eee',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                onClick={() => setPreviewAgreement(null)}
                disabled={isSigning}
              >
                닫기
              </button>
              {canSignAsPartner(previewAgreement) && (
                <button
                  style={{
                    flex: 1,
                    padding: '0.7rem',
                    background: '#785cd2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    opacity: isSigning ? 0.6 : 1
                  }}
                  onClick={handleSignAgreement}
                  disabled={isSigning || !partnerSignature}
                >
                  {isSigning ? '서명 중...' : '서명 완료'}
                </button>
              )}
            </div>
          </PreviewModalBox>
        </ModalOverlay>
      )}
      {/* PDF 전용 A4 컴포넌트 (화면에는 안 보임) */}
      {isPdfMode && previewAgreement && (
        <div style={{ position: 'absolute', left: -9999, top: 0 }} ref={pdfRef}>
          <PdfAgreementA4 agreement={previewAgreement} />
        </div>
      )}
      
      {/* PDF 저장 확인 모달 */}
      <ConfirmationModal
        isOpen={showPdfConfirmModal}
        onRequestClose={() => {
          setShowPdfConfirmModal(false);
          setPendingPdfAgreement(null);
        }}
        onConfirm={handleDownloadPdf}
        title="인증 발행"
        message="이 합의서를 공식 인증 문서로 발행하시겠습니까? 발행된 PDF에는 QR코드와 고유 식별값이 포함되어 신뢰성을 보장합니다."
        confirmButtonText="발행"
        cancelButtonText="취소"
      />
    </>
  );
};

// AgreementListInner: 샘플/실제 리스트 렌더링용 내부 컴포넌트
const AgreementListInner: React.FC<{
  agreements: Agreement[];
  isSample?: boolean;
  onView: (agreement: Agreement) => void;
  onDownload: (agreement: Agreement) => void;
}> = ({ agreements, onView, onDownload }) => {
  const user = useAuthStore((state) => state.user);
  
  const getStatusMessage = (agreement: Agreement) => {
    if (agreement.status === 'completed') {
      return { text: '✅ 합의 완료', color: '#28a745' };
    }
    if (agreement.status === 'cancelled') {
      return { text: '❌ 취소됨', color: '#dc3545' };
    }
    
    const isAuthor = user?.id === agreement.authorId;
    const isPartner = user?.id === agreement.partnerId;
    
    if (agreement.status === 'pending') {
      if (isAuthor) {
        return { text: '서명 요청중', color: '#ffc107' };
      } else if (isPartner) {
        return { text: '서명 필요', color: '#007bff' };
      }
    }
    
    if (agreement.status === 'signed') {
      if (isAuthor && agreement.authorSignature && !agreement.partnerSignature) {
        return { text: '서명 요청중', color: '#ffc107' };
      } else if (isPartner && agreement.partnerSignature && !agreement.authorSignature) {
        return { text: '서명 요청중', color: '#ffc107' };
      } else if (isAuthor && !agreement.authorSignature) {
        return { text: '서명 필요', color: '#007bff' };
      } else if (isPartner && !agreement.partnerSignature) {
        return { text: '서명 필요', color: '#007bff' };
      }
    }
    
    return { text: '❓ 알수없음', color: '#6c757d' };
  };
  return (
    <ListContainer>
      {agreements.length === 0 && (
        <EmptyText>
          아직 작성된 합의서가 없습니다.
          <EmptySubText>위의 "합의서 작성" 버튼을 눌러 첫 번째 합의서를 작성해보세요!</EmptySubText>
        </EmptyText>
      )}
      {agreements.map((agreement) => (
        <Card key={agreement.id} $sample={agreement.isSample}>
          {!agreement.isSample && (
            <StatusBadge $color={getStatusMessage(agreement).color}>
              {getStatusMessage(agreement).text}
            </StatusBadge>
          )}
          <Title>{agreement.title}</Title>
          <Content>{agreement.content}</Content>
          <Meta>✔️ 합의일: {agreement.date} | 동의자: {agreement.partnerName}</Meta>
          <Actions>
            <Btn primary onClick={() => onView(agreement)}>확인하기</Btn>
            <Btn onClick={() => onDownload(agreement)}>인증 발행</Btn>
          </Actions>
        </Card>
      ))}
    </ListContainer>
  );
};

// 미리보기/모달 스타일
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
const PreviewModalBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 350px;
  height: 495px;
  max-width: 95vw;
  max-height: 95vh;
  box-shadow: 0 2px 16px rgba(0,0,0,0.12);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  z-index: 2000;
`;
const ModalTitle = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;
const ModalSection = styled.div`
  margin-top: 1.2rem;
`;
const ModalLabel = styled.div`
  font-weight: bold;
  color: #444;
  margin-bottom: 0.2rem;
  font-size: 0.9rem;
`;
const ModalValue = styled.div`
  padding: 0.6rem 0.8rem;
  background: #f1f3f6;
  border-radius: 6px;
  color: #333;
  font-size: 0.9rem;
  line-height: 1.4;
`;
const SignatureImg = styled.img`
  width: 100%;
  height: 50px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
const SignatureLabel = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.2rem;
`;
const SignatureBox = styled.div`
  flex: 1;
  min-width: 120px;
`;
const ModalFooter = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: #777;
  margin-top: 1.5rem;
  line-height: 1.3;
`;

export default AgreementList; 