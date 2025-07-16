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
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
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
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const MarkAllReadButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const NotificationItem = styled.div<{ read: boolean }>`
  padding: 1rem;
  color: ${props => props.read ? '#888' : '#333'};
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  background-color: ${props => props.read ? '#fff' : '#f8f9fa'};
  border-left: 4px solid ${props => props.read ? 'transparent' : '#007bff'};
  transition: all 0.2s ease;
  
  &:last-child {
      border-bottom: none;
  }

  &:hover {
    background-color: ${props => props.read ? '#f8f9fa' : '#e3f2fd'};
  }
`;

const NotificationMessage = styled.div<{ read: boolean }>`
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
    font-weight: ${props => props.read ? 'normal' : '600'};
`;

const NotificationTime = styled.div`
    font-size: 0.75rem;
    color: #aaa;
`;

const UnreadIndicator = styled.div`
  width: 8px;
  height: 8px;
  background: #007bff;
  border-radius: 50%;
  margin-right: 0.5rem;
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
`;

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
  font-size: 0.9rem;
`;

const NotificationBell = () => {
  const { notifications, hasUnread, unreadCount, markAllAsRead, markAsRead, updateHasUnread, fetchUnreadCount } = useNotificationStore();
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

  const handleMarkAllRead = () => {
    markAllAsRead();
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

  // hasUnread 상태를 주기적으로 업데이트
  useEffect(() => {
    updateHasUnread();
  }, [notifications, updateHasUnread]);

  // 주기적으로 읽지 않은 알림 개수 업데이트 (더 가벼운 API 호출)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 15000); // 15초마다

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

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
          <ModalHeader>
            알림 {unreadCount > 0 && `(${unreadCount})`}
            {unreadCount > 0 && (
              <MarkAllReadButton onClick={handleMarkAllRead}>
                모두 읽음 처리
              </MarkAllReadButton>
            )}
          </ModalHeader>
          {sortedNotifications.length === 0 ? (
            <EmptyState>새 알림이 없습니다.</EmptyState>
          ) : (
            sortedNotifications.map(n => (
              <NotificationItem
                key={n.id}
                read={n.read}
                onClick={() => handleNotificationClick(n)}
              >
                <NotificationContent>
                  {!n.read && <UnreadIndicator />}
                  <div style={{ flex: 1 }}>
                    <NotificationMessage read={n.read}>{n.message}</NotificationMessage>
                    <NotificationTime>
                        {new Date(n.createdAt).toLocaleString()}
                    </NotificationTime>
                  </div>
                </NotificationContent>
              </NotificationItem>
            ))
          )}
        </NotificationModal>
      )}
    </BellWrapper>
  );
};

export default NotificationBell; 