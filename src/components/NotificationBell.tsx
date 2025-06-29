import { useState, useEffect, useRef } from 'react';
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
  top: 45px;
  right: 0;
  width: 320px;
  background: #fff;
  border-radius: 0.7rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  z-index: 100;
  padding: 0;
  max-height: 400px;
  overflow-y: auto;
`;

const ModalHeader = styled.h4`
    padding: 1rem;
    margin: 0;
    border-bottom: 1px solid #f0f0f0;
`;

const NotificationItem = styled.div<{ read: boolean }>`
  padding: 1rem;
  color: ${props => props.read ? '#888' : '#333'};
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  border-bottom: 1px solid #f0f0f0;
  background-color: ${props => props.read ? '#fff' : '#f8f9fa'};
  
  &:last-child {
      border-bottom: none;
  }

  &:hover {
    background-color: #f1f3f5;
  }
`;

const NotificationMessage = styled.div`
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
`;

const NotificationTime = styled.div`
    font-size: 0.75rem;
    color: #aaa;
`;


const NotificationBell = () => {
  const { notifications, hasUnread, markAllAsRead, markAsRead } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const bellRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setOpen(!open);
    if (!open && hasUnread) {
        markAllAsRead();
    }
  };

  const handleNotificationClick = (n: Notification) => {
    if (!n.read) {
      markAsRead(n.id);
    }
    if (n.url) {
      navigate(n.url);
      setOpen(false);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [bellRef]);

  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <BellWrapper ref={bellRef}>
      <div onClick={handleClick}>
        <IconBell width={28} height={28} />
        {hasUnread && <RedDot />}
      </div>
      {open && (
        <NotificationModal onClick={(e) => e.stopPropagation()}>
          <ModalHeader>알림</ModalHeader>
          {sortedNotifications.length === 0 ? (
            <div style={{ padding: '1rem', color: '#888' }}>새 알림이 없습니다.</div>
          ) : (
            sortedNotifications.map(n => (
              <NotificationItem
                key={n.id}
                read={n.read}
                onClick={() => handleNotificationClick(n)}
              >
                <NotificationMessage>{n.message}</NotificationMessage>
                <NotificationTime>
                    {new Date(n.createdAt).toLocaleString()}
                </NotificationTime>
              </NotificationItem>
            ))
          )}
        </NotificationModal>
      )}
    </BellWrapper>
  );
};

export default NotificationBell; 