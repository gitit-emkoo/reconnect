import React, { useState } from 'react';
import styled from 'styled-components';
import NavigationBar from '../components/NavigationBar';
import { Agreement } from '../components/agreement/AgreementList';

const Container = styled.div`
  background-color: white;
  padding: 2rem;
  padding-bottom: 70px;
  height: auto;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #4A4A4A;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const VerificationCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.12);
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #785cd2;
  }
`;

const Button = styled.button<{ $primary?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$primary ? '#785cd2' : '#666'};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.8rem 0;
  position: relative;
  transition: color 0.2s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: #ccc;
  }

  &:hover:not(:disabled) {
    color: ${props => props.$primary ? '#6a4fc7' : '#333'};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: currentColor;
    transition: width 0.2s ease;
  }

  &:hover:not(:disabled)::after {
    width: 100%;
  }
`;

const ResultCard = styled.div<{ $valid: boolean }>`
  background: ${props => props.$valid ? '#d4edda' : '#f8d7da'};
  border: 1px solid ${props => props.$valid ? '#c3e6cb' : '#f5c6cb'};
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const ResultTitle = styled.h3<{ $valid: boolean }>`
  color: ${props => props.$valid ? '#155724' : '#721c24'};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AgreementInfo = styled.div`
  background: white;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Label = styled.span`
  font-weight: 600;
  color: #555;
`;

const Value = styled.span`
  color: #333;
`;

const AgreementVerification: React.FC = () => {
  const [agreementId, setAgreementId] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    agreement?: Agreement;
    message: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // 샘플 합의서 데이터 (실제로는 API에서 가져옴)
  const sampleAgreements: Agreement[] = [
    {
      id: '1703123456789',
      title: '감정 표현 방식',
      content: '이번주 부터 매주 일요일 저녁, 30분간 감정 공유 시간을 갖기로 함',
      date: '2024-12-21 14:30 (KST)',
      partnerName: '이몽룡',
      authorName: '홍길동',
      agreementHash: 'a1b2c3d4e5f6',
      authorSignatureHash: 'sig123456',
      partnerSignatureHash: 'sig789012',
      qrCodeData: JSON.stringify({
        agreementId: '1703123456789',
        title: '감정 표현 방식',
        date: '2024-12-21 14:30 (KST)',
        authorName: '홍길동',
        partnerName: '이몽룡',
        agreementHash: 'a1b2c3d4e5f6'
      })
    }
  ];

  const verifyAgreement = async () => {
    if (!agreementId.trim()) return;
    
    setIsVerifying(true);
    
    // 실제로는 API 호출
    setTimeout(() => {
      const agreement = sampleAgreements.find(a => a.id === agreementId);
      
      if (agreement) {
        setVerificationResult({
          valid: true,
          agreement,
          message: '합의서가 성공적으로 인증되었습니다.'
        });
      } else {
        setVerificationResult({
          valid: false,
          message: '해당 ID의 합의서를 찾을 수 없습니다.'
        });
      }
      
      setIsVerifying(false);
    }, 1000);
  };

  const handleQRScan = () => {
    // 실제로는 QR 스캐너 라이브러리 사용
    alert('QR 스캔 기능은 별도 라이브러리 설치가 필요합니다.');
  };

  const clearResult = () => {
    setVerificationResult(null);
    setAgreementId('');
  };

  return (
    <>
      <Container>
        <Title>🔐 합의서 인증</Title>
        
        <VerificationCard>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>합의서 ID로 검증</h3>
          <Input
            type="text"
            placeholder="합의서 ID를 입력하세요 (예: 1703123456789)"
            value={agreementId}
            onChange={(e) => setAgreementId(e.target.value)}
          />
          <Button 
            $primary 
            onClick={verifyAgreement}
            disabled={!agreementId.trim() || isVerifying}
          >
            {isVerifying ? '검증 중...' : '검증하기'}
          </Button>
          
          <Button onClick={handleQRScan}>
            📱 QR 코드로 스캔
          </Button>
        </VerificationCard>

        {verificationResult && (
          <ResultCard $valid={verificationResult.valid}>
            <ResultTitle $valid={verificationResult.valid}>
              {verificationResult.valid ? '✅' : '❌'}
              {verificationResult.valid ? '인증 성공' : '인증 실패'}
            </ResultTitle>
            
            <p style={{ 
              color: verificationResult.valid ? '#155724' : '#721c24',
              marginBottom: '1rem'
            }}>
              {verificationResult.message}
            </p>

            {verificationResult.agreement && (
              <AgreementInfo>
                <InfoRow>
                  <Label>합의서 ID:</Label>
                  <Value>{verificationResult.agreement.id}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>제목:</Label>
                  <Value>{verificationResult.agreement.title}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>작성자:</Label>
                  <Value>{verificationResult.agreement.authorName}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>동의자:</Label>
                  <Value>{verificationResult.agreement.partnerName}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>작성일:</Label>
                  <Value>{verificationResult.agreement.date}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>인증 해시:</Label>
                  <Value>{verificationResult.agreement.agreementHash}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>서명 상태:</Label>
                  <Value>
                    {verificationResult.agreement.authorSignatureHash && 
                     verificationResult.agreement.partnerSignatureHash 
                      ? '✅ 양쪽 서명 완료' 
                      : '⚠ 서명 미완료'}
                  </Value>
                </InfoRow>
              </AgreementInfo>
            )}

            <Button onClick={clearResult} style={{ marginTop: '1rem' }}>
              다시 검증하기
            </Button>
          </ResultCard>
        )}

        <VerificationCard>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>💡 사용법</h3>
          <div style={{ fontSize: '0.7rem', color: '#666', lineHeight: '1.6' }}>
            <p>• 합의서 ID는 발행된 합의서에서 확인할 수 있습니다.</p>
            <p>• QR 코드를 스캔하여 빠르게 검증할 수 있습니다.</p>
            <p>• 인증된 합의서만 유효한 것으로 간주됩니다.</p>
            <p>• 서명이 완료된 합의서는 법정에서 사용할 수 있습니다.</p>
          </div>
        </VerificationCard>
      </Container>
      <NavigationBar />
    </>
  );
};

export default AgreementVerification; 