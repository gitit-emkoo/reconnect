import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PageLayout from '../components/Layout/PageLayout';
import Header from '../components/common/Header';
import { ADMIN_CONFIG } from '../config/admin';
import useAuthStore from '../store/authStore';
import { adminApi } from '../api/user';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background: #ff6fcb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #e55bb8;
  }
`;

const SortSelect = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background: #f8f9fa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: #e9ecef;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
`;

const UserRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const RoleBadge = styled.span<{ role: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.role === 'ADMIN' ? '#dc3545' : '#28a745'};
  color: white;
`;

const StatusBadge = styled.span<{ isActive: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.isActive ? '#28a745' : '#6c757d'};
  color: white;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;
  background: ${props => props.variant === 'danger' ? '#dc3545' : '#007bff'};
  color: white;

  &:hover {
    background: ${props => props.variant === 'danger' ? '#c82333' : '#0056b3'};
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#ff6fcb' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: ${props => props.active ? '#e55bb8' : '#f8f9fa'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const UserDetailSection = styled.div`
  margin-bottom: 20px;
`;

const UserDetailTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
`;

const UserDetailText = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 14px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ff6fcb;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

interface User {
  id: string;
  email: string;
  nickname: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  profileImageUrl?: string;
  partner?: {
    id: string;
    nickname: string;
    email: string;
  };
  couple?: {
    id: string;
    createdAt: string;
  };
}

interface UserDetail extends User {
  fcmToken?: string;
  diaries?: Array<{
    id: string;
    createdAt: string;
    emotion: string;
  }>;
  sentEmotionCards?: Array<{
    id: string;
    createdAt: string;
    message: string;
  }>;
}

type SortField = 'createdAt' | 'updatedAt' | 'email' | 'nickname' | 'role';
type SortOrder = 'asc' | 'desc';

const UserAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    connected: 0
  });

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      if (user.email && ADMIN_CONFIG.isAdmin(user.email, user.role)) {
        setIsAuthorized(true);
        loadUsers();
      } else {
        window.location.href = '/dashboard';
      }
    }
  }, [user]);

  const loadUsers = async (page = 1, search = '', sort = sortField, order = sortOrder) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getAllUsers({
        page,
        limit: 20,
        search: search || undefined,
      });
      
      // 클라이언트 사이드 정렬
      let sortedUsers = [...data.users];
      sortedUsers.sort((a, b) => {
        let aValue = a[sort];
        let bValue = b[sort];
        
        if (sort === 'createdAt' || sort === 'updatedAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }
        
        if (order === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      setUsers(sortedUsers);
      setTotalPages(data.pagination.totalPages);
      setTotalUsers(data.pagination.total);
      setCurrentPage(page);
      
      // 백엔드에서 받은 통계 사용
      setStats(data.stats);
    } catch (err) {
      setError('유저 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadUsers(1, searchTerm);
  };

  const handleSort = (field: SortField) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    loadUsers(currentPage, searchTerm, field, newOrder);
  };

  const handleUserDetail = async (userId: string) => {
    try {
      const userDetail = await adminApi.getUserById(userId);
      setSelectedUser(userDetail);
      setShowModal(true);
    } catch (err) {
      alert('유저 상세 정보를 불러오는 데 실패했습니다.');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!window.confirm(`이 유저의 역할을 ${newRole}로 변경하시겠습니까?`)) {
      return;
    }

    try {
      await adminApi.updateUserRole(userId, newRole);
      loadUsers(currentPage, searchTerm);
      alert('역할이 성공적으로 변경되었습니다.');
    } catch (err) {
      alert('역할 변경에 실패했습니다.');
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    const action = isActive ? '활성화' : '비활성화';
    if (!window.confirm(`이 유저를 ${action}하시겠습니까?`)) {
      return;
    }

    try {
      await adminApi.updateUserStatus(userId, isActive);
      loadUsers(currentPage, searchTerm);
      alert(`유저가 성공적으로 ${action}되었습니다.`);
    } catch (err) {
      alert(`유저 ${action}에 실패했습니다.`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (!user || !isAuthorized) {
    return <LoadingSpinner />;
  }

  return (
    <PageLayout title="유저 관리">
      <Header title="유저 관리" />
      <AdminContainer>
        {/* 통계 카드 */}
        <StatsContainer>
          <StatCard>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>전체 유저</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.active}</StatNumber>
            <StatLabel>활성 유저</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.inactive}</StatNumber>
            <StatLabel>비활성 유저</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.admins}</StatNumber>
            <StatLabel>관리자</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.connected}</StatNumber>
            <StatLabel>파트너 연결</StatLabel>
          </StatCard>
        </StatsContainer>

        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="이메일 또는 닉네임으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
          <SortSelect
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field] = e.target.value.split('-') as [SortField, SortOrder];
              handleSort(field);
            }}
          >
            <option value="createdAt-desc">가입일 (최신순)</option>
            <option value="createdAt-asc">가입일 (오래된순)</option>
            <option value="email-asc">이메일 (A-Z)</option>
            <option value="email-desc">이메일 (Z-A)</option>
            <option value="nickname-asc">닉네임 (A-Z)</option>
            <option value="nickname-desc">닉네임 (Z-A)</option>
            <option value="role-asc">역할 (A-Z)</option>
            <option value="role-desc">역할 (Z-A)</option>
          </SortSelect>
        </SearchContainer>

        {loading && <LoadingSpinner />}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!loading && !error && (
          <>
            <div style={{ marginBottom: '10px', color: '#666' }}>
              총 {totalUsers}명의 유저
            </div>
            
            <UserTable>
              <thead>
                <tr>
                  <TableHeader onClick={() => handleSort('email')}>
                    이메일 {getSortIcon('email')}
                  </TableHeader>
                  <TableHeader onClick={() => handleSort('nickname')}>
                    닉네임 {getSortIcon('nickname')}
                  </TableHeader>
                  <TableHeader onClick={() => handleSort('role')}>
                    역할 {getSortIcon('role')}
                  </TableHeader>
                  <TableHeader>상태</TableHeader>
                  <TableHeader>파트너</TableHeader>
                  <TableHeader onClick={() => handleSort('createdAt')}>
                    가입일 {getSortIcon('createdAt')}
                  </TableHeader>
                  <TableHeader>관리</TableHeader>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.nickname}</TableCell>
                    <TableCell>
                      <RoleBadge role={user.role}>
                        {user.role === 'ADMIN' ? '관리자' : '일반'}
                      </RoleBadge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge isActive={user.role !== 'DELETED'}>
                        {user.role !== 'DELETED' ? '활성' : '비활성'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      {user.partner ? user.partner.nickname : '-'}
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <ActionButton onClick={() => handleUserDetail(user.id)}>
                        상세
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleRoleChange(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                      >
                        {user.role === 'ADMIN' ? '일반으로' : '관리자로'}
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        onClick={() => handleStatusChange(user.id, user.role === 'DELETED')}
                      >
                        {user.role !== 'DELETED' ? '비활성화' : '활성화'}
                      </ActionButton>
                    </TableCell>
                  </UserRow>
                ))}
              </tbody>
            </UserTable>

            <PaginationContainer>
              <PaginationButton
                onClick={() => loadUsers(currentPage - 1, searchTerm)}
                disabled={currentPage === 1}
              >
                이전
              </PaginationButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationButton
                  key={page}
                  active={page === currentPage}
                  onClick={() => loadUsers(page, searchTerm)}
                >
                  {page}
                </PaginationButton>
              ))}
              
              <PaginationButton
                onClick={() => loadUsers(currentPage + 1, searchTerm)}
                disabled={currentPage === totalPages}
              >
                다음
              </PaginationButton>
            </PaginationContainer>
          </>
        )}

        {showModal && selectedUser && (
          <Modal onClick={() => setShowModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <h2>유저 상세 정보</h2>
              <UserDetailSection>
                <UserDetailTitle>기본 정보</UserDetailTitle>
                <UserDetailText><strong>이메일:</strong> {selectedUser.email}</UserDetailText>
                <UserDetailText><strong>닉네임:</strong> {selectedUser.nickname}</UserDetailText>
                <UserDetailText><strong>역할:</strong> {selectedUser.role}</UserDetailText>
                <UserDetailText><strong>상태:</strong> {selectedUser.role !== 'DELETED' ? '활성' : '비활성'}</UserDetailText>
                <UserDetailText><strong>가입일:</strong> {formatDate(selectedUser.createdAt)}</UserDetailText>
                <UserDetailText><strong>최종 수정:</strong> {formatDate(selectedUser.updatedAt)}</UserDetailText>
              </UserDetailSection>

              {selectedUser.partner && (
                <UserDetailSection>
                  <UserDetailTitle>파트너 정보</UserDetailTitle>
                  <UserDetailText><strong>파트너 닉네임:</strong> {selectedUser.partner.nickname}</UserDetailText>
                  <UserDetailText><strong>파트너 이메일:</strong> {selectedUser.partner.email}</UserDetailText>
                </UserDetailSection>
              )}

              {selectedUser.couple && (
                <UserDetailSection>
                  <UserDetailTitle>커플 정보</UserDetailTitle>
                  <UserDetailText><strong>커플 생성일:</strong> {formatDate(selectedUser.couple.createdAt)}</UserDetailText>
                </UserDetailSection>
              )}

              {selectedUser.diaries && selectedUser.diaries.length > 0 && (
                <UserDetailSection>
                  <UserDetailTitle>최근 일기 (최대 10개)</UserDetailTitle>
                  {selectedUser.diaries.map((diary) => (
                    <UserDetailText key={diary.id}>
                      {formatDate(diary.createdAt)} - {diary.emotion}
                    </UserDetailText>
                  ))}
                </UserDetailSection>
              )}

              {selectedUser.sentEmotionCards && selectedUser.sentEmotionCards.length > 0 && (
                <UserDetailSection>
                  <UserDetailTitle>최근 감정카드 (최대 10개)</UserDetailTitle>
                  {selectedUser.sentEmotionCards.map((card) => (
                    <UserDetailText key={card.id}>
                      {formatDate(card.createdAt)} - {card.message}
                    </UserDetailText>
                  ))}
                </UserDetailSection>
              )}

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <ActionButton onClick={() => setShowModal(false)}>
                  닫기
                </ActionButton>
              </div>
            </ModalContent>
          </Modal>
        )}
      </AdminContainer>
    </PageLayout>
  );
};

export default UserAdmin; 