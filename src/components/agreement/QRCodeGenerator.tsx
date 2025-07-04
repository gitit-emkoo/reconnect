import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import QRCode from 'qrcode';
import { Agreement } from './AgreementList';

interface QRCodeGeneratorProps {
  agreement: Agreement;
  size?: number;
  showVerificationInfo?: boolean;
}

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const QRImage = styled.img`
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const VerificationInfo = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: #666;
  max-width: 200px;
`;

const ReconnectLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  color:rgb(60, 54, 79);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  agreement, 
  size = 150,
  showVerificationInfo = true 
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    generateQRCode();
  }, [agreement]);

  const generateQRCode = async () => {
    try {
      // QR 코드에 포함할 데이터
      const qrData = {
        agreementId: agreement.id,
        title: agreement.title,
        date: agreement.date,
        authorName: agreement.authorName,
        partnerName: agreement.partnerName,
        agreementHash: agreement.agreementHash,
        authorSignatureHash: agreement.authorSignatureHash,
        partnerSignatureHash: agreement.partnerSignatureHash,
        verificationUrl: `https://reconnect.app/verify/${agreement.id}`,
        timestamp: new Date().toISOString(),
        platform: 'Reconnect'
      };

      const qrString = JSON.stringify(qrData);
      const url = await QRCode.toDataURL(qrString, {
        width: size,
        margin: 2,
        color: {
          dark: '#785cd2', // 리커넥트 브랜드 컬러
          light: '#ffffff'
        }
      });
      
      setQrCodeUrl(url);
    } catch (error) {
      console.error('QR 코드 생성 실패:', error);
    }
  };

  const handleQRClick = () => {
    if (qrCodeUrl) {
      // QR 코드를 새 창에서 열기
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>리커넥트 합의서 인증 QR코드</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 2rem;
                  background: #f5f5f5;
                }
                .container {
                  background: white;
                  padding: 2rem;
                  border-radius: 12px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                  max-width: 400px;
                  margin: 0 auto;
                }
                img { 
                  max-width: 100%; 
                  height: auto;
                  border: 1px solid #ddd;
                  border-radius: 8px;
                }
                h2 { color: #785cd2; }
                .info { 
                  margin-top: 1rem; 
                  font-size: 0.9rem; 
                  color: #666; 
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>🤝 리커넥트 합의서 인증</h2>
                <img src="${qrCodeUrl}" alt="QR Code" />
                <div class="info">
                  <p><strong>합의서 ID:</strong> ${agreement.id}</p>
                  <p><strong>제목:</strong> ${agreement.title}</p>
                  <p><strong>작성일:</strong> ${agreement.date}</p>
                  <p>이 QR코드를 스캔하여 합의서의 진위를 확인할 수 있습니다.</p>
                </div>
              </div>
            </body>
          </html>
        `);
      }
    }
  };

  return (
    <QRContainer>
      <ReconnectLogo>
        <span>🔐</span>
        리커넥트 인증 QR코드
      </ReconnectLogo>
      
      {qrCodeUrl && (
        <QRImage 
          src={qrCodeUrl} 
          alt="합의서 인증 QR코드"
          onClick={handleQRClick}
          style={{ cursor: 'pointer' }}
          title="클릭하여 QR코드 확대보기"
        />
      )}
      
      {showVerificationInfo && (
        <VerificationInfo>
          <div>합의서 ID: {agreement.id}</div>
          <div>인증 해시: {agreement.agreementHash?.substring(0, 8)}...</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            이 QR코드로 합의서의 진위를 확인할 수 있습니다
          </div>
        </VerificationInfo>
      )}
    </QRContainer>
  );
};

export default QRCodeGenerator; 