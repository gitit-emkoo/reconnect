import React, { useState } from 'react';
import styled from 'styled-components';

// 모달 스타일링
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative; // 닫기 버튼 위치 기준
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  &:hover {
    color: #333;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const TextArea = styled.textarea`
  width: calc(100% - 2rem); // padding 고려
  min-height: 100px;
  margin-top: 1rem;
  padding: 1rem;
  font-size: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #ccc;
  resize: none;
  box-sizing: border-box;
`;

const ButtonGroup = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ShareButton = styled.button<{ bg: string; textColor?: string }>`
  background: ${({ bg }) => bg}; // 그라데이션을 위해 background 사용
  color: ${({ textColor }) => textColor || 'white'}; // textColor prop 또는 기본 흰색
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 500; // 두께 추가
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.9;
  }
`;

interface InviteModalProps {
  onClose: () => void;
  onInviteSuccess?: () => void; // 초대 성공 시 추가 액션 (옵션)
}

export const InviteModal: React.FC<InviteModalProps> = ({ onClose, onInviteSuccess }) => {
  const defaultMessage = "요즘 우리 대화가 줄어든 것 같아. 부담 없이 이 앱으로 같이 시작해볼래?";
  const [message, setMessage] = useState(defaultMessage);

  // 실제 초대 API 호출 로직이 필요합니다.
  // 현재는 alert만 표시하고 닫습니다.
  const handleShare = async (platform: "kakao" | "link") => {
    // TODO: 실제 카카오 SDK 연동 또는 링크 생성/복사 로직 구현
    // 예시: navigator.clipboard.writeText(inviteLink);
    alert(`초대 메시지가 ${platform === "kakao" ? "카카오톡" : "링크"}(으)로 공유 준비 완료!\n(실제 기능 연동 필요)`);
    
    // 초대 로직 성공했다고 가정
    if (onInviteSuccess) {
      onInviteSuccess();
    }
    onClose(); // 모달 _닫_기
  };

  return (
    <ModalOverlay onClick={onClose}> {/* 오버레이 클릭 시 _닫_기 */}
      <ModalContent onClick={(e) => e.stopPropagation()}> {/* 모달 내부 클릭 시 전파 중단 */}
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>파트너에게 초대 메시지 보내기</Title>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <ButtonGroup>
          <ShareButton 
            bg="#FEE500" 
            textColor="#3C1E1E" // 카카오 노란색 배경에 어두운 글씨
            onClick={() => handleShare("kakao")}
          >
            카카오톡으로 보내기
          </ShareButton>
          <ShareButton 
            bg="linear-gradient(to right, #FF69B4, #FF1493)" // 진단페이지 '예' 버튼 스타일
            onClick={() => handleShare("link")}
          >
            초대 링크 복사
          </ShareButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}; 