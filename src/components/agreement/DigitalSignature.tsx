import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import SignatureCanvas from 'react-signature-canvas';

interface DigitalSignatureProps {
  onSignatureChange: (signature: string, hash: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SignatureContainer = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
  margin: 1rem 0;
`;

const CanvasContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: ${props => props.$primary ? '#785cd2' : '#e0e0e0'};
  color: ${props => props.$primary ? 'white' : '#333'};
  cursor: pointer;
  font-size: 0.9rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SignatureStatus = styled.div<{ $signed: boolean }>`
  font-size: 0.9rem;
  color: ${props => props.$signed ? '#28a745' : '#dc3545'};
  margin-top: 0.5rem;
  font-weight: 500;
`;

// 간단한 해시 함수 (실제 프로덕션에서는 crypto-js 등 사용 권장)
const simpleHash = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit 정수로 변환
  }
  return Math.abs(hash).toString(16);
};

const DigitalSignature: React.FC<DigitalSignatureProps> = ({ 
  onSignatureChange, 
  placeholder = "여기에 서명해주세요",
  disabled = false 
}) => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isSigned, setIsSigned] = useState(false);


  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsSigned(false);
      onSignatureChange('', '');
    }
  };

  const saveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const signature = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
      const hash = simpleHash(signature + Date.now().toString());
      

      setIsSigned(true);
      onSignatureChange(signature, hash);
    }
  };

  const handleCanvasChange = () => {
    if (signatureRef.current) {
      const isEmpty = signatureRef.current.isEmpty();
      setIsSigned(!isEmpty);
    }
  };

  return (
    <SignatureContainer>
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
        {placeholder}
      </div>
      
      <CanvasContainer>
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            width: 400,
            height: 150,
            className: 'signature-canvas',
            style: { 
              width: '100%', 
              height: '150px',
              opacity: disabled ? 0.5 : 1,
              pointerEvents: disabled ? 'none' : 'auto'
            }
          }}
          onEnd={handleCanvasChange}
          backgroundColor="white"
          penColor="#333"
        />
      </CanvasContainer>

      <ButtonGroup>
        <Button 
          onClick={saveSignature} 
          disabled={disabled || signatureRef.current?.isEmpty()}
          $primary
        >
          서명 완료
        </Button>
        <Button onClick={clearSignature} disabled={disabled}>
          다시 서명
        </Button>
      </ButtonGroup>

      <SignatureStatus $signed={isSigned}>
        {isSigned ? '✓ 서명이 완료되었습니다' : '⚠ 서명이 필요합니다'}
      </SignatureStatus>
    </SignatureContainer>
  );
};

export default DigitalSignature; 