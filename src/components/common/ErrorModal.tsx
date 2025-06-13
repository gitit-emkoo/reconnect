import styled from 'styled-components';

const ModalBackground = styled.div`
  position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 9999;
`;
const ModalBox = styled.div`
  background: #fff; border-radius: 12px; padding: 2rem 1.5rem; min-width: 260px; box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  text-align: center;
`;
const Button = styled.button`
  margin-top: 1.5rem; padding: 0.5rem 1.2rem; border: none; border-radius: 6px; background: #8A2BE2; color: #fff; font-weight: bold; cursor: pointer;
`;

const ErrorModal = ({ open, message, onClose }: { open: boolean, message: string, onClose: () => void }) => {
  if (!open) return null;
  return (
    <ModalBackground>
      <ModalBox>
        <div>{message}</div>
        <Button onClick={onClose}>확인</Button>
      </ModalBox>
    </ModalBackground>
  );
};

export default ErrorModal; 