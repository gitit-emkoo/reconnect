import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
// import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { blockApi } from '../api/user';
import { getUserAvatar } from '../utils/avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Header from '../components/common/Header';
import NavigationBar from '../components/NavigationBar';
import LeftActive from '../assets/DirectionLeftActive.svg?url';
import LeftInactive from '../assets/DirectionLeftInactive.svg?url';
import RightActive from '../assets/DirectionRightActive.svg?url';
import RightInactive from '../assets/DirectionRightInactive.svg?url';

const Container = styled.div`
  background-color: white;
  padding: 1.25rem 1rem 2rem;
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: #f1f3f5;
  color: #495057;
  font-size: 0.8rem;
  font-weight: 600;
`;

const TopMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 0.75rem;
`;

const MetaLabel = styled.span`
  color: #868e96;
  font-size: 0.9rem;
  margin-right: 8px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  outline: none;
  font-size: 0.95rem;
  &:focus { border-color: #785cd2; box-shadow: 0 0 0 3px rgba(120,92,210,0.12); }
`;

const List = styled.div`
  margin-top: 0.75rem;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.7rem 0.2rem;
  border-bottom: 1px solid #eee;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Nickname = styled.div`
  font-weight: 600;
  color: #343a40;
`;

const UnblockButton = styled.button`
  background: #adb5bd;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.35rem 0.8rem;
  font-weight: 600;
  cursor: pointer;
`;

const PaginationBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 1rem;
`;

const PaginationButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0;
  cursor: ${({ $active }) => ($active ? 'pointer' : 'not-allowed')};
  display: flex;
  align-items: center;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
`;

const PaginationText = styled.span`
  font-size: 1rem;
  color: #495057;
  font-weight: 600;
`;

const EmptyState = styled.div`
  color: #999;
  font-size: 0.95rem;
  text-align: center;
  padding: 2rem 0.5rem;
`;

const PAGE_SIZE = 20;

const BlockedUsersPage: React.FC = () => {
  /* no-op */
  const accessToken = useAuthStore((state) => state.accessToken);
  const [loading, setLoading] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<Array<{ id: string; nickname: string; email: string; profileImageUrl?: string }>>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      if (!accessToken) return;
      setLoading(true);
      try {
        const list = await blockApi.getMyBlocks();
        setBlockedUsers(list);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accessToken]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blockedUsers;
    return blockedUsers.filter(u =>
      u.nickname?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [blockedUsers, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const handleUnblock = async (userId: string) => {
    try {
      await blockApi.unblockUser(userId);
      const next = blockedUsers.filter(b => b.id !== userId);
      setBlockedUsers(next);
      // 현재 페이지가 비게 되면 이전 페이지로 이동
      const nextFilteredCount = (query ? next.filter(u => u.nickname?.toLowerCase().includes(query.toLowerCase()) || u.email?.toLowerCase().includes(query.toLowerCase())) : next).length;
      const nextPages = Math.max(1, Math.ceil(nextFilteredCount / PAGE_SIZE));
      setPage(p => Math.min(p, nextPages));
    } catch {
      alert('차단 해제 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Header title="차단 사용자 관리" showBackButton />
      {loading ? (
        <LoadingSpinner fullscreen={false} size={60} />
      ) : (
        <Container>
          <TopMeta>
            <MetaLabel>차단된 유저</MetaLabel>
            <CountBadge>{filtered.length}</CountBadge>
          </TopMeta>

          <SearchInput
            placeholder="닉네임 또는 이메일 검색"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />

          {filtered.length === 0 ? (
            <EmptyState>차단한 사용자가 없습니다.</EmptyState>
          ) : (
            <>
              <List>
                {pageItems.map(u => (
                  <ListItem key={u.id}>
                    <Info>
                      <img src={u.profileImageUrl || getUserAvatar({ id: u.id, email: u.email, nickname: u.nickname } as any)} alt={u.nickname} style={{ width: 38, height: 38, borderRadius: '50%' }} />
                      <div>
                        <Nickname>{u.nickname}</Nickname>
                      </div>
                    </Info>
                    <UnblockButton onClick={() => handleUnblock(u.id)}>차단 해제</UnblockButton>
                  </ListItem>
                ))}
              </List>

              {totalPages > 1 && (
                <PaginationBottom>
                  <PaginationButton $active={currentPage > 1} onClick={() => currentPage > 1 && setPage(currentPage - 1)}>
                    <img src={currentPage > 1 ? LeftActive : LeftInactive} alt="이전" width={36} />
                  </PaginationButton>
                  <PaginationText>{currentPage} / {totalPages}</PaginationText>
                  <PaginationButton $active={currentPage < totalPages} onClick={() => currentPage < totalPages && setPage(currentPage + 1)}>
                    <img src={currentPage < totalPages ? RightActive : RightInactive} alt="다음" width={36} />
                  </PaginationButton>
                </PaginationBottom>
              )}
            </>
          )}
        </Container>
      )}
      <NavigationBar />
    </>
  );
};

export default BlockedUsersPage;


