import { useState } from 'react';
import useNotificationStore, { Notification } from '../store/notificationsStore';
import { ReactComponent as IconBell } from '../assets/Icon_Bell.svg';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const BellWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const RedDot = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: #ff4b4b;
  border-radius: 50%;
  border: 2px solid #fff;
`;

const NotificationModal = styled.div`
  position: absolute;
  top: 36px;
  right: 0;
  width: 280px;
  background: #fff;
  border-radius: 0.7rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  z-index: 100;
  padding: 1rem;
`;

const NotificationBell = () => {
  const { notifications, hasUnread, markAllAsRead } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!open);
    if (!open) {
        markAllAsRead();
    }
  };

  const handleNotificationClick = (n: Notification) => {
    if (n.url) {
      navigate(n.url);
      setOpen(false);
    }
  };

  return (
    <BellWrapper onClick={handleClick}>
      <IconBell width={28} height={28} />
      {hasUnread && <RedDot />}
      {open && (
        <NotificationModal onClick={(e) => e.stopPropagation()}>
          <h4 style={{ margin: '0 0 1rem 0' }}>알림</h4>
          {notifications.length === 0 ? (
            <div style={{ color: '#888' }}>새 알림이 없습니다.</div>
          ) : (
            [...notifications].reverse().map(n => (
              <div
                key={n.id}
                style={{ marginBottom: 8, color: n.read ? '#888' : '#333', cursor: n.url ? 'pointer' : 'default', borderBottom: '1px solid #eee', paddingBottom: '8px' }}
                onClick={() => handleNotificationClick(n)}
              >
                {n.message}
              </div>
            ))
          )}
        </NotificationModal>
      )}
    </BellWrapper>
  );
};

export default NotificationBell; 