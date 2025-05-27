import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 2rem;
  background-color: #f0fdfa;
`;

const Box = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  max-width: 90%;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  margin-top: 1rem;
  padding: 1rem;
  font-size: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #ccc;
  resize: none;
`;

const ButtonGroup = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ShareButton = styled.button<{ color: string }>`
  background-color: ${({ color }) => color};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const Invite: React.FC = () => {
  const navigate = useNavigate();
  const defaultMessage = "요즘 우리 대화가 줄어든 것 같아. 부담 없이 이 앱으로 같이 시작해볼래?";
  const [message, setMessage] = useState(defaultMessage);

  const handleShare = (platform: "kakao" | "link") => {
    alert(`초대 메시지가 ${platform === "kakao" ? "카카오톡" : "링크"}로 전송되었습니다!`);
    navigate("/main/shared");
  };

  return (
    <Container>
      <Box>
        <Title>파트너에게 초대 메시지를 보내보세요</Title>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <ButtonGroup>
          <ShareButton color="#3b82f6" onClick={() => handleShare("kakao")}>
            카카오톡 보내기
          </ShareButton>
          <ShareButton color="#10b981" onClick={() => handleShare("link")}>
            링크 복사하기
          </ShareButton>
        </ButtonGroup>
      </Box>
    </Container>
  );
};

export default Invite;
