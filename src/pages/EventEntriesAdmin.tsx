import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container as BaseContainer } from '../styles/CommonStyles';
import Header from '../components/common/Header';
import NavigationBar from '../components/NavigationBar';
import useAuthStore from '../store/authStore';
import { ADMIN_CONFIG } from '../config/admin';
import { eventsApi } from '../api/events';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Container = styled(BaseContainer)`
  background-color: white;
  padding: 1rem 1rem 1.5rem;
`;

const List = styled.div`
  margin-top: 1rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.25rem;
  border-bottom: 1px solid #eee;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Name = styled.div`
  font-weight: 600;
  color: #343a40;
`;

const Email = styled.div`
  color: #999;
  font-size: 12px;
`;

const EventEntriesAdmin: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<Array<{ id: string; createdAt: string; user: { id: string; nickname: string; email: string; profileImageUrl?: string } }>>([]);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated || !user) return;
      const isAdmin = ADMIN_CONFIG.isAdmin(user.email, user.role);
      if (!isAdmin) return;
      setLoading(true);
      try {
        const res = await eventsApi.listEntries();
        setEntries(res.entries || []);
      } catch (e) {
        // 백엔드가 AdminGuard로 보호 중이므로 접근 실패 시 노출만 방지
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated, user]);

  return (
    <>
      <Header title="이벤트 참여 내역" showBackButton />
      <Container>
        {loading ? (
          <LoadingSpinner fullscreen={false} size={60} />
        ) : (
          <>
            {entries.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center', padding: '2rem 0' }}>참여 내역이 없습니다.</div>
            ) : (
              <List>
                {entries.map((e) => (
                  <Row key={e.id}>
                    <UserInfo>
                      <img src={e.user.profileImageUrl || '/images/reconnect.png'} alt={e.user.nickname} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                      <div>
                        <Name>{e.user.nickname}</Name>
                        <Email>{e.user.email}</Email>
                      </div>
                    </UserInfo>
                    <div style={{ color: '#868e96', fontSize: 12 }}>{new Date(e.createdAt).toLocaleString()}</div>
                  </Row>
                ))}
              </List>
            )}
          </>
        )}
      </Container>
      <NavigationBar />
    </>
  );
};

export default EventEntriesAdmin;






