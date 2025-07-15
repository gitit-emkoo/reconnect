import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Agreement } from '../components/agreement/AgreementList';
import useAuthStore from '../store/authStore';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import NavigationBar from '../components/NavigationBar';
import { agreementApi } from '../api/agreement';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCodeGenerator from '../components/agreement/QRCodeGenerator';
import Skeleton from '../components/common/Skeleton';

const Container = styled.div`
  max-width: 480px;
  margin: 1rem 1.2rem 1rem;
  padding: 0 0 80px;
`;

const Card = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1.2rem;
  position: relative;
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
  gap: 1.5rem;
`;

const TextButton = styled.button<{primary?: boolean, pink?: boolean, disabled?: boolean}>`
  background: none;
  border: none;
  font-size: 0.95rem;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  color: ${({ primary, pink, disabled }) =>
    disabled ? '#ccc' : pink ? '#ff69b4' : primary ? '#785cd2' : '#666'};
  font-weight: 600;
  padding: 0.3rem 0;
  position: relative;
  transition: color 0.2s ease;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};

  &:hover {
    color: ${({ primary, pink, disabled }) =>
      disabled ? '#ccc' : pink ? '#e55a9e' : primary ? '#6a4fc7' : '#333'};
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

// PDF 렌더링용 스타일 컴포넌트들
const PdfContainer = styled.div`
  width: 794px;
  height: 1123px;
  background: #fff;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transform: scale(0.92);
  transform-origin: top left;
  font-size: 13px;
  overflow: hidden;
  position: relative;
`;

const PdfTitle = styled.h2`
  text-align: center;
  color: #333;
  font-size: 22px;
  margin-bottom: 14px;
`;

const PdfSection = styled.div`
  margin-bottom: 10px;
`;

const PdfLabel = styled.b`
  display: block;
`;

const PdfContent = styled.div`
  background: #f1f3f6;
  border-radius: 6px;
  padding: 8px;
  margin-top: 3px;
  font-size: 13px;
`;

const PdfSignatureContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  gap: 16px;
`;

const PdfSignatureBox = styled.div`
  flex: 1;
`;

const PdfSignatureLabel = styled.div`
  font-size: 11px;
  color: #666;
  margin-bottom: 3px;
`;

const PdfSignatureImage = styled.img`
  width: 100%;
  height: 40px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const PdfAgreementId = styled.div`
  color: #888;
  font-size: 14px;
  margin-top: 16px;
  margin-bottom: 8px;
  text-align: left;
`;

const PdfQrContainer = styled.div`
  position: absolute;
  right: 24px;
  bottom: 120px;
  width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 12px;
`;

const PdfQrInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 113px;
  height: 113px;
`;

const PdfFooter = styled.div`
  position: absolute;
  left: 0;
  bottom: 24px;
  width: 100%;
  text-align: center;
`;

const PdfFooterText = styled.div`
  color: #888;
  font-size: 13px;
  margin-bottom: 4px;
`;

const PdfTimestamp = styled.div`
  color: #aaa;
  font-size: 12px;
  margin-bottom: 4px;
`;

const PdfHash = styled.div`
  color: #888;
  font-size: 12px;
  word-break: break-all;
  letter-spacing: 0.02em;
`;

// ====== Styled Components for Issued Agreement Modal ======
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;
const ModalBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.8rem;
  max-width: 90%;
  max-height: 90%;
  min-width: 320px;
  overflow: auto;
  position: relative;
`;
const ModalTitle = styled.h3`
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 700;
  font-size: 1.25rem;
  text-align: center;
`;
const ModalField = styled.div`
  margin-bottom: 1rem;
`;
const ModalLabel = styled.div`
  font-weight: bold;
`;
const ModalValue = styled.div`
  background: #f1f3f6;
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  margin-top: 4px;
`;
const SignatureBox = styled.div`
  min-width: 120px;
  flex: 1;
`;
const SignatureLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
`;
const SignatureImg = styled.img`
  width: 100%;
  height: 50px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
const ModalFooter = styled.div`
  color: #888;
  font-size: 13px;
  margin-bottom: 4px;
  
`;
const ModalCloseButton = styled.button`
  margin-top: 20px;
  padding: 0.5rem 1rem;
  background-color: #785cd2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
  font-size: 16px;
`;

const IssuedAgreementsPage: React.FC = () => {
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewAgreement, setPreviewAgreement] = useState<Agreement | null>(null);
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [pdfTimestamp, setPdfTimestamp] = useState<string | null>(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 새로고침 트리거 추가
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // 합의서 데이터 로드 함수
  const loadAgreements = async () => {
    try {
      setIsLoading(true);
      const data = await agreementApi.findMyAgreements();
      // API 데이터를 기존 컴포넌트 형식으로 변환
      const transformedData: Agreement[] = data.map(agreement => ({
        id: agreement.id,
        title: agreement.title,
        content: agreement.content,
        condition: agreement.condition,
        date: new Date(agreement.createdAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\./g, '-'),
        partnerName: agreement.partner?.nickname || '알 수 없음',
        authorName: agreement.author?.nickname || '알 수 없음',
        authorId: agreement.authorId,
        partnerId: agreement.partnerId,
        authorSignature: agreement.authorSignature,
        partnerSignature: agreement.partnerSignature || undefined,
        status: agreement.status,
        createdAt: agreement.createdAt
      }));
      setAgreements(transformedData);
      console.log('발행 합의서 목록 로드 완료:', transformedData.filter(a => a.status === 'issued'));
    } catch (error) {
      console.error('합의서 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 합의서 데이터 로드
  useEffect(() => {
    loadAgreements();
  }, [refreshTrigger]); // refreshTrigger 의존성 추가

  // 페이지 포커스 시 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      console.log('페이지 포커스 - 합의서 목록 새로고침');
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const issuedAgreements = agreements.filter(a => a.status === 'issued');

  // PDF 전용 A4 컴포넌트
  const PdfAgreementA4 = ({ agreement }: { agreement: Agreement }) => (
    <PdfContainer>
      <PdfTitle>RECONNECT 인증 합의서</PdfTitle>
      
      <PdfSection>
        <PdfLabel>제목</PdfLabel>
        <PdfContent>{agreement.title}</PdfContent>
      </PdfSection>
      
      <PdfSection>
        <PdfLabel>내용</PdfLabel>
        <PdfContent>{agreement.content}</PdfContent>
      </PdfSection>
      
      <PdfSection>
        <PdfLabel>미이행시 조건</PdfLabel>
        <PdfContent>{agreement.condition}</PdfContent>
      </PdfSection>
      
      <PdfSection>
        <PdfLabel>작성자</PdfLabel>
        <PdfContent>{agreement.authorName}</PdfContent>
      </PdfSection>
      
      <PdfSection>
        <PdfLabel>동의자</PdfLabel>
        <PdfContent>{agreement.partnerName}</PdfContent>
      </PdfSection>
      
      <PdfSection>
        <PdfLabel>작성일 및 서명시간</PdfLabel>
        <PdfContent>{agreement.date}</PdfContent>
      </PdfSection>
      
      <PdfSignatureContainer>
        {agreement.authorSignature && (
          <PdfSignatureBox>
            <PdfSignatureLabel>작성자 서명</PdfSignatureLabel>
            <PdfSignatureImage src={agreement.authorSignature} alt="작성자 서명" />
          </PdfSignatureBox>
        )}
        {agreement.partnerSignature && (
          <PdfSignatureBox>
            <PdfSignatureLabel>동의자 서명</PdfSignatureLabel>
            <PdfSignatureImage src={agreement.partnerSignature} alt="동의자 서명" />
          </PdfSignatureBox>
        )}
      </PdfSignatureContainer>
      
      {/* 합의서 ID: 왼쪽 상단 */}
      <PdfAgreementId>합의서 ID: {agreement.id}</PdfAgreementId>
      
      {/* QR코드: 오른쪽 하단 */}
      <PdfQrContainer>
        <PdfQrInner>
          <QRCodeGenerator agreement={agreement} size={113} showVerificationInfo={false} />
        </PdfQrInner>
      </PdfQrContainer>
      
      {/* 하단 안내/생성일/고유값: 중앙 정렬 */}
      <PdfFooter>
        <PdfFooterText>※ 이 합의서는 리커넥트에서 발급된 공식 문서입니다.</PdfFooterText>
        {pdfTimestamp && (
          <PdfTimestamp>PDF 생성일시: {pdfTimestamp}</PdfTimestamp>
        )}
        {agreement.agreementHash && (
          <PdfHash>고유 식별값: {agreement.agreementHash}</PdfHash>
        )}
      </PdfFooter>
    </PdfContainer>
  );

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

  // PDF 다운로드 처리
  const handlePdfButtonClick = (agreement: Agreement) => {
    if (user?.subscriptionStatus !== 'SUBSCRIBED') {
      setShowSubscribeModal(true);
      return;
    }
    
    // PDF 다운로드 로직 (기존 AgreementList의 로직과 동일)
    setIsPdfMode(true);
    setPreviewAgreement(agreement);
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
    }, 300);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Header title="발행 합의서 보관함" />
      <BackButton />
      <Container>
        {/* 새로고침 버튼 제거 */}
        
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
        ) : issuedAgreements.length > 0 ? (
          <>
            {/* 정렬 드롭다운 */}
            <SortContainer>
              <SortDropdown ref={dropdownRef}>
                <SortButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  {sortOrder === 'latest' ? '최신순' : '오래된순'}
                  <span>▼</span>
                </SortButton>
                <DropdownContent $isOpen={isDropdownOpen}>
                  <DropdownItem 
                    $active={sortOrder === 'latest'}
                    onClick={() => {
                      setSortOrder('latest');
                      setIsDropdownOpen(false);
                    }}
                  >
                    최신순
                  </DropdownItem>
                  <DropdownItem 
                    $active={sortOrder === 'oldest'}
                    onClick={() => {
                      setSortOrder('oldest');
                      setIsDropdownOpen(false);
                    }}
                  >
                    오래된순
                  </DropdownItem>
                </DropdownContent>
              </SortDropdown>
            </SortContainer>
            
            {sortAgreements(issuedAgreements).map((agreement) => (
              <Card key={agreement.id}>
                <TitleText>{agreement.title}</TitleText>
                <Content>{agreement.content}</Content>
                <Meta>✔️ 합의일: {agreement.date} | 동의자: {agreement.partnerName}</Meta>
                <Actions>
                  <TextButton primary onClick={() => setPreviewAgreement(agreement)}>확인하기</TextButton>
                  <TextButton 
                    pink={user?.subscriptionStatus === 'SUBSCRIBED'}
                    disabled={user?.subscriptionStatus !== 'SUBSCRIBED'}
                    onClick={() => handlePdfButtonClick(agreement)}
                  >
                    {user?.subscriptionStatus === 'SUBSCRIBED' ? 'PDF 재발행' : '구독 필요'}
                  </TextButton>
                </Actions>
              </Card>
            ))}
          </>
        ) : (
          <EmptyState>
            <EmptyTitle>📄 발행된 합의서가 없습니다</EmptyTitle>
            <EmptyDescription>
              합의서를 PDF로 발행하면 이곳에 보관됩니다. 발행된 합의서는 수정 및 위/변조가 불가능한 증명 문서로 보관됩니다.
            </EmptyDescription>
          </EmptyState>
        )}
      </Container>
      <NavigationBar />

      {/* PDF 렌더링용 숨겨진 div */}
      {previewAgreement && isPdfMode && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div ref={pdfRef}>
            <PdfAgreementA4 agreement={previewAgreement} />
          </div>
        </div>
      )}

      {/* 미리보기 모달 */}
      {previewAgreement && !isPdfMode && (
        <ModalOverlay onClick={() => setPreviewAgreement(null)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalTitle>공동 합의서</ModalTitle>
            <ModalField><ModalLabel>약속 주제</ModalLabel><ModalValue>{previewAgreement.title}</ModalValue></ModalField>
            <ModalField><ModalLabel>약속 내용</ModalLabel><ModalValue>{previewAgreement.content}</ModalValue></ModalField>
            <ModalField><ModalLabel>미이행시 조건</ModalLabel><ModalValue>{previewAgreement.condition}</ModalValue></ModalField>
            <ModalField><ModalLabel>작성자</ModalLabel><ModalValue>{previewAgreement.authorName}</ModalValue></ModalField>
            <ModalField><ModalLabel>동의자</ModalLabel><ModalValue>{previewAgreement.partnerName}</ModalValue></ModalField>
            <ModalField><ModalLabel>작성일 및 서명시간</ModalLabel><ModalValue>{previewAgreement.date}</ModalValue></ModalField>
            {/* 서명 섹션 */}
            <ModalField>
              <ModalLabel>서명</ModalLabel>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: 8 }}>
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
            </ModalField>
            <ModalFooter>※ 이 합의서는 리커넥트에서 발급된 공식 문서입니다.</ModalFooter>
            <ModalCloseButton onClick={() => setPreviewAgreement(null)}>닫기</ModalCloseButton>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* 구독 모달 */}
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
    </>
  );
};

export default IssuedAgreementsPage; 