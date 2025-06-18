import React from 'react';
import styled from 'styled-components';
import { formatInKST } from '../../utils/date';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  emoji?: string;
  description?: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  todayKey?: string;
  children?: React.ReactNode;
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const PopupBox = styled.div`
  background: linear-gradient(135deg, #ffe0ec 0%, #f7e6ff 100%);
  border-radius: 1.5rem;
  padding: 2.2rem 1.7rem 1.7rem 1.7rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  min-width: 320px;
  max-width: 90vw;
  text-align: center;
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 1.2rem;
  color: #7a295a;
  margin-bottom: 0.7rem;
`;

const Emoji = styled.div`
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
`;

const Description = styled.div`
  color: #555;
  font-size: 1.05rem;
  margin-bottom: 1.3rem;
  line-height: 1.6;
`;

const MainButton = styled.button`
  background: linear-gradient(90deg, #ff7fa9 0%, #ffb6b9 100%);
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 1rem 0;
  width: 100%;
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 0.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px #ffb6b933;
  transition: background 0.18s;
  &:hover {
    background: linear-gradient(90deg, #ff7fa9 0%, #ff7fa9 100%);
  }
`;

const TodayBox = styled.div`
  margin-top: 1.5rem;
  text-align: left;
`;

const Popup: React.FC<PopupProps> = ({
  isOpen, onClose, title, emoji, description, buttonText, onButtonClick, todayKey, children
}) => {
  const [dontShowToday, setDontShowToday] = React.useState(false);

  const getTodayKey = () => {
    if (!todayKey) return '';
    const today = new Date();
    const ymd = formatInKST(today, 'yyyyMMdd');
    return `${todayKey}_${ymd}`;
  };

  const handleClose = () => {
    if (dontShowToday && todayKey) {
      localStorage.setItem(getTodayKey(), 'true');
    }
    onClose();
  };

  if (!isOpen) return null;
  return (
    <Backdrop onClick={handleClose}>
      <PopupBox onClick={e => e.stopPropagation()}>
        <CloseBtn onClick={handleClose}>&times;</CloseBtn>
        {title && <Title>{title}</Title>}
        {emoji && <Emoji>{emoji}</Emoji>}
        {description && <Description>{description}</Description>}
        {children}
        {buttonText && (
          <MainButton onClick={onButtonClick}>{buttonText}</MainButton>
        )}
        {todayKey && (
          <TodayBox>
            <label style={{ fontSize: 14, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={dontShowToday}
                onChange={e => setDontShowToday(e.target.checked)}
                style={{ marginRight: 6 }}
              />
              오늘 하루 그만보기
            </label>
          </TodayBox>
        )}
      </PopupBox>
    </Backdrop>
  );
};

export default Popup; 