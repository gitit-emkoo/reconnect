import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import useAuthStore from '../../store/authStore';
import { agreementApi } from '../../api/agreement';
import QRCodeGenerator from './QRCodeGenerator';
import DigitalSignature from './DigitalSignature';
import ConfirmationModal from '../common/ConfirmationModal';
import Skeleton from '../common/Skeleton';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';

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
  status?: string; // 합의서 상태: 'pending' | 'completed' | 'issued' | 'cancelled'
  isSample?: boolean; // 샘플 합의서 여부
  createdAt?: string; // 생성일시
}

// ===== STYLED COMPONENTS =====

// 메인 컨테이너
const Container = styled.div`
  padding: 1.5rem;
`;

// 리스트 컨테이너
const ListContainer = styled.div`
  background: rgb(255, 255, 255);
  border-radius: 12px;
`;

// 카드 스타일
const Card = styled.div<{ $sample?: boolean }>`
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1.2rem;
  position: relative;
`;

// 상태 배지
const StatusBadge = styled.div<{ $color?: string }>` 
  position: absolute;
  right: 0;
  top: 0;
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.$color || '#666'};
  background: none;
  border: 1px solid ${props => props.$color || '#ddd'};
  border-radius: 4px;
  text-align: center;
`;

// 텍스트 스타일
const Title = styled.div`
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

const EmptyText = styled.div`
  text-align: center;
  color: #888;
  margin-top: 2rem;
`;

const EmptySubText = styled.div`
  font-size: 0.88rem;
  color: #888;
  margin-top: 0.7rem;
`;

// 액션 버튼
const Actions = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1.5rem;
`;

const TextButton = styled.button<{primary?: boolean, pink?: boolean, red?: boolean, disabled?: boolean}>`
  background: none;
  border: none;
  font-size: 0.95rem;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  color: ${({ primary, pink, red, disabled }) =>
    disabled ? '#ccc' : red ? '#dc3545' : pink ? '#ff69b4' : primary ? '#785cd2' : '#666'};
  font-weight: 600;
  padding: 0.3rem 0;
  position: relative;
  transition: color 0.2s ease;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};

  &:hover {
    color: ${({ primary, pink, red, disabled }) =>
      disabled ? '#ccc' : red ? '#c82333' : pink ? '#e55a9e' : primary ? '#6a4fc7' : '#333'};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: currentColor;
    transition: width 0.2s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

// 정렬 드롭다운 스타일
const SortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 0.5rem;
  position: relative;
`;

const SortDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const SortButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 400;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 100px;
  justify-content: space-between;

  &:hover {
    background: #f8f9fa;
    border-color: #ccc;
  }
`;

const DropdownContent = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 100px;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.div<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: ${props => props.$active ? '#ff69b4' : '#666'};
  font-weight: ${props => props.$active ? '600' : '400'};
  background: ${props => props.$active ? '#fff5f8' : 'transparent'};

  &:hover {
    background: ${props => props.$active ? '#fff5f8' : '#f8f9fa'};
  }

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;

// 모달 스타일
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
  max-width: 95vw;
  height: 90vh;
  max-height: 90vh;
  box-shadow: 0 2px 16px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ModalContent = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
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
  flex-shrink: 0;
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.8rem;
  color: #777;
  line-height: 1.3;
  background: white;
`;

// ===== MAIN COMPONENT =====

const AgreementList: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewAgreement, setPreviewAgreement] = useState<Agreement | null>(null);
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [pdfTimestamp, setPdfTimestamp] = useState<string | null>(null);
  const [partnerSignature, setPartnerSignature] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [showPdfConfirmModal, setShowPdfConfirmModal] = useState(false);
  const [pendingPdfAgreement, setPendingPdfAgreement] = useState<Agreement | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [pendingDeleteAgreement, setPendingDeleteAgreement] = useState<Agreement | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 새로고침 트리거 추가
  const pdfRef = useRef<HTMLDivElement>(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const navigate = useNavigate();
  const [showPdfSuccessModal, setShowPdfSuccessModal] = useState(false);

  // 실제 합의서 목록 불러오기
  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        setIsLoading(true);
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
          createdAt: apiAgreement.createdAt, // 정렬을 위해 createdAt 필드 추가
        }));
        setAgreements(converted);
      } catch (err) {
        console.error('합의서 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgreements();
  }, [refreshTrigger]); // refreshTrigger 의존성 추가

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
        position: 'relative',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#333', fontSize: 22, marginBottom: 14 }}>RECONNECT 인증 합의서</h2>
      <div style={{ marginBottom: 10 }}><b>제목</b><div style={{ background: '#f1f3f6', borderRadius: 6, padding: 8, marginTop: 3, fontSize: 13 }}>{agreement.title}</div></div>
      <div style={{ marginBottom: 10 }}><b>내용</b><div style={{ background: '#f1f3f6', borderRadius: 6, padding: 8, marginTop: 3, fontSize: 13 }}>{agreement.content}</div></div>
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
      {/* 합의서 ID: 왼쪽 상단 */}
      {agreement.status === 'completed' && (
        <>
          <div style={{ color: '#888', fontSize: 14, marginTop: 16, marginBottom: 8, textAlign: 'left' }}>
            합의서 ID: {agreement.id}
          </div>
          {/* QR코드: 오른쪽 하단 */}
          <div style={{
            position: 'absolute',
            right: 24,
            bottom: 120, // 하단 안내문구와 겹치지 않게 여유
            width: 180,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            padding: 12,
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
        
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 113,
              height: 113,
            }}>
              <QRCodeGenerator agreement={agreement} size={113} showVerificationInfo={false} />
            </div>
          </div>
          {/* 하단 안내/생성일/고유값: 중앙 정렬 */}
          <div style={{
            position: 'absolute',
            left: 0,
            bottom: 24,
            width: '100%',
            textAlign: 'center',
          }}>
            <div style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>
              ※ 이 합의서는 리커넥트에서 발급된 공식 문서입니다.
            </div>
            {pdfTimestamp && (
              <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>
                PDF 생성일시: {pdfTimestamp}
              </div>
            )}
            {agreement.agreementHash && (
              <div style={{
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
    // 구독 여부 확인
    if (user?.subscriptionStatus !== 'SUBSCRIBED') {
      setShowSubscribeModal(true);
      return;
    }
    
    // PDF 발행 조건 확인
    if (!agreement.authorSignature || !agreement.partnerSignature) {
      alert('PDF 발행을 위해서는 작성자와 동의자 모두의 서명이 필요합니다.');
      return;
    }
    
    setPendingPdfAgreement(agreement);
    setShowPdfConfirmModal(true);
  };

  const handleDeleteButtonClick = (agreement: Agreement) => {
    setPendingDeleteAgreement(agreement);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteAgreement = async () => {
    if (!pendingDeleteAgreement) return;
    
    try {
      await agreementApi.deleteAgreement(pendingDeleteAgreement.id);
      // 성공 시 합의서 목록에서 제거
      setAgreements(prev => prev.filter(a => a.id !== pendingDeleteAgreement.id));
      setShowDeleteConfirmModal(false);
      setPendingDeleteAgreement(null);
    } catch (err) {
      console.error('합의서 삭제 실패:', err);
      // 에러 처리 (필요시 alert 또는 다른 방식으로 처리)
    }
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
      
      try {
        const canvas = await html2canvas(pdfRef.current, { width: 794, height: 1123, scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [794, 1123] });
        pdf.addImage(imgData, 'PNG', 0, 0, 794, 1123);
        const dateStr = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
        const coupleId = user?.couple?.id || 'samplecouple';
        pdf.save(`reconnect_${dateStr}_${coupleId}.pdf`);
        
        console.log('PDF 다운로드 완료, 상태 업데이트 시작:', pendingPdfAgreement.id);
        console.log('현재 합의서 상태:', pendingPdfAgreement.status);
        console.log('작성자 서명:', !!pendingPdfAgreement.authorSignature);
        console.log('파트너 서명:', !!pendingPdfAgreement.partnerSignature);
        
        // PDF 저장 성공 후 백엔드에서 상태를 'issued'로 변경
        try {
          await agreementApi.updateStatus(pendingPdfAgreement.id, { status: 'issued' });
          console.log('백엔드 상태 업데이트 성공');
          
          // 성공 시 새로고침 트리거로 목록 완전 새로고침
          setRefreshTrigger(prev => prev + 1);
          
          // 사용자에게 성공 메시지 표시
          setShowPdfSuccessModal(true);
        } catch (err) {
          console.error('PDF 발행 상태 업데이트 실패:', err);
          
          // PDF는 저장되었지만 상태 업데이트 실패 시 처리
          // 실패해도 로컬에서는 제거 (사용자 경험 개선)
          setAgreements(prev => {
            const filtered = prev.filter(a => a.id !== pendingPdfAgreement.id);
            console.log('백엔드 실패했지만 로컬에서 제거. 남은 합의서 수:', filtered.length);
            return filtered;
          });
          
          // 사용자에게 부분 성공 메시지 표시
          alert('PDF 다운로드는 완료되었지만, 서버 업데이트에 실패했습니다. 페이지를 새로고침하거나 발행 합의서 보관함을 확인해주세요.');
        }
      } catch (pdfError) {
        console.error('PDF 생성 실패:', pdfError);
      }
      
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
    <Container>
      {isLoading ? (
        // 스켈레톤 UI
        <div style={{ padding: '1.5rem' }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} style={{ padding: '1.5rem', borderBottom: '1px solid #e0e0e0', marginBottom: '1.2rem' }}>
              <Skeleton width="70%" height={22} style={{ marginBottom: '0.5rem' }} />
              <Skeleton width="100%" height={16} style={{ marginBottom: '0.3rem' }} />
              <Skeleton width="85%" height={16} style={{ marginBottom: '0.7rem' }} />
              <Skeleton width="60%" height={14} style={{ marginBottom: '1rem' }} />
              <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1rem' }}>
                <Skeleton width={80} height={36} />
                <Skeleton width={100} height={36} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 기존 리스트: 발행되지 않은 합의서만 */
        <AgreementListInner
          agreements={agreements.filter(a => a.status !== 'issued')}
          isSample={false}
          onView={setPreviewAgreement}
          onDownload={handlePdfButtonClick}
          onDelete={handleDeleteButtonClick}
        />
      )}
      {/* 미리보기 모달 */}
      {previewAgreement && !isPdfMode && (
        <ModalOverlay onClick={() => setPreviewAgreement(null)}>
          <PreviewModalBox ref={pdfRef} onClick={e => e.stopPropagation()}>
            <ModalContent>
              <ModalTitle>공동 합의서</ModalTitle>
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
            </ModalContent>
            <ModalFooter>
              * 본 문서는 리커넥트 앱 내 사용자 간 심리적 합의 기록용으로 작성되었습니다.
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
                    {isSigning ? '서명 중...' : '합의 완료'}
                  </button>
                )}
              </div>
            </ModalFooter>
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
        message="합의서를 pdf로 발행 및 저장 합니다. 합의 내용과 함께 보증코드·생성시간·서명정보가 포함되며 수정 및 위/변조가 불가한 증명 문서로 보관 됩니다."
        confirmButtonText="발행"
        cancelButtonText="취소"
      />
      
      {/* 삭제 확인 모달 */}
      <ConfirmationModal
        isOpen={showDeleteConfirmModal}
        onRequestClose={() => {
          setShowDeleteConfirmModal(false);
          setPendingDeleteAgreement(null);
        }}
        onConfirm={handleDeleteAgreement}
        title="합의서 삭제"
        message="정말로 이 합의서를 삭제하시겠습니까? 삭제된 합의서는 복구할 수 없습니다."
        confirmButtonText="삭제"
        cancelButtonText="취소"
      />
      
      <ConfirmationModal
        isOpen={showSubscribeModal}
        onRequestClose={() => setShowSubscribeModal(false)}
        onConfirm={() => {
          setShowSubscribeModal(false);
          navigate('/subscribe');
        }}
        title="구독 안내"
        message="무료구독 후 사용하세요."
        confirmButtonText="구독하러 가기"
        cancelButtonText="취소"
        showCancelButton={true}
      />
      
      {/* PDF 발행 성공 모달 */}
      <ConfirmationModal
        isOpen={showPdfSuccessModal}
        onRequestClose={() => setShowPdfSuccessModal(false)}
        onConfirm={() => {
          setShowPdfSuccessModal(false);
          navigate('/issued-agreements');
        }}
        title="PDF 발행 완료"
        message="PDF 발행이 완료되었습니다! 발행 합의서 보관함에서 확인할 수 있습니다."
        confirmButtonText="확인"
        showCancelButton={false}
      />
    </Container>
  );
};

// ===== INNER COMPONENT =====

// AgreementListInner: 샘플/실제 리스트 렌더링용 내부 컴포넌트
const AgreementListInner: React.FC<{
  agreements: Agreement[];
  isSample?: boolean;
  onView: (agreement: Agreement) => void;
  onDownload: (agreement: Agreement) => void;
  onDelete: (agreement: Agreement) => void;
}> = ({ agreements, onView, onDownload, onDelete }) => {
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending_author' | 'pending_partner'>('all');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // 합의서 필터링 및 정렬 함수
  const filterAndSortAgreements = (agreements: Agreement[]) => {
    const user = useAuthStore((state) => state.user);
    
    // 상태별 필터링
    let filteredAgreements = agreements;
    if (statusFilter !== 'all') {
      filteredAgreements = agreements.filter(agreement => {
        switch (statusFilter) {
          case 'completed':
            return agreement.status === 'completed';
          case 'pending_author':
            return agreement.status === 'pending' && user?.id === agreement.authorId;
          case 'pending_partner':
            return agreement.status === 'pending' && user?.id === agreement.partnerId;
          default:
            return true;
        }
      });
    }
    
    // 정렬
    return filteredAgreements.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      
      if (sortOrder === 'latest') {
        return dateB.getTime() - dateA.getTime(); // 최신순
      } else {
        return dateA.getTime() - dateB.getTime(); // 오래된순
      }
    });
  };
  const user = useAuthStore((state) => state.user);
  
  const getStatusMessage = (agreement: Agreement) => {
    if (agreement.status === 'issued') {
      return { text: '📄 PDF 발행됨', color: '#ff69b4' };
    }
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
    
    return { text: '❓ 알수없음', color: '#6c757d' };
  };

  // 필터링 옵션 표시 텍스트
  const getFilterDisplayText = () => {
    switch (statusFilter) {
      case 'all':
        return '전체';
      case 'completed':
        return '합의완료';
      case 'pending_author':
        return '서명요청';
      case 'pending_partner':
        return '서명필요';
      default:
        return '전체';
    }
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <ListContainer>
      {/* 정렬 및 필터 드롭다운 */}
      {agreements.length > 0 && (
        <SortContainer>
          {/* 필터 드롭다운 */}
          <SortDropdown ref={filterDropdownRef}>
            <SortButton onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}>
              {getFilterDisplayText()}
              <span>▼</span>
            </SortButton>
            <DropdownContent $isOpen={isFilterDropdownOpen}>
              <DropdownItem 
                $active={statusFilter === 'all'}
                onClick={() => {
                  setStatusFilter('all');
                  setIsFilterDropdownOpen(false);
                }}
              >
                전체
              </DropdownItem>
              <DropdownItem 
                $active={statusFilter === 'completed'}
                onClick={() => {
                  setStatusFilter('completed');
                  setIsFilterDropdownOpen(false);
                }}
              >
                합의완료
              </DropdownItem>
              <DropdownItem 
                $active={statusFilter === 'pending_author'}
                onClick={() => {
                  setStatusFilter('pending_author');
                  setIsFilterDropdownOpen(false);
                }}
              >
                서명요청
              </DropdownItem>
              <DropdownItem 
                $active={statusFilter === 'pending_partner'}
                onClick={() => {
                  setStatusFilter('pending_partner');
                  setIsFilterDropdownOpen(false);
                }}
              >
                서명필요
              </DropdownItem>
            </DropdownContent>
          </SortDropdown>
          
          {/* 정렬 드롭다운 */}
          <SortDropdown ref={sortDropdownRef}>
            <SortButton onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}>
              {sortOrder === 'latest' ? '최신순' : '오래된순'}
              <span>▼</span>
            </SortButton>
            <DropdownContent $isOpen={isSortDropdownOpen}>
              <DropdownItem 
                $active={sortOrder === 'latest'}
                onClick={() => {
                  setSortOrder('latest');
                  setIsSortDropdownOpen(false);
                }}
              >
                최신순
              </DropdownItem>
              <DropdownItem 
                $active={sortOrder === 'oldest'}
                onClick={() => {
                  setSortOrder('oldest');
                  setIsSortDropdownOpen(false);
                }}
              >
                오래된순
              </DropdownItem>
            </DropdownContent>
          </SortDropdown>
        </SortContainer>
      )}
      
      {filterAndSortAgreements(agreements).length === 0 && (
        <EmptyText>
          {statusFilter === 'all' ? (
            <>
              아직 작성된 합의서가 없습니다.
              <EmptySubText>위의 "합의서 작성" 버튼을 눌러 <br/>첫 번째 합의서를 작성해보세요!</EmptySubText>
            </>
          ) : (
            <>
              해당 상태의 합의서가 없습니다.
              <EmptySubText>다른 필터를 선택하거나 새로운 합의서를 작성해보세요!</EmptySubText>
            </>
          )}
        </EmptyText>
      )}
      {filterAndSortAgreements(agreements).map((agreement) => (
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
            <TextButton primary onClick={() => onView(agreement)}>확인하기</TextButton>
            <TextButton
              onClick={() => onDownload(agreement)}
              disabled={agreement.status !== 'completed'}
              pink={agreement.status === 'completed' && user?.subscriptionStatus === 'SUBSCRIBED'}
            >
              인증 발행
            </TextButton>
            {agreement.status !== 'issued' && (
              <TextButton 
                onClick={() => onDelete(agreement)}
                red
              >
                삭제
              </TextButton>
            )}
          </Actions>
        </Card>
      ))}
    </ListContainer>
  );
};

export default AgreementList; 