import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useAuthStore from '../store/authStore';
import { ProfileEditModal } from "../components/Profile/ProfileEditModal";
import { PasswordChangeModal } from "../components/Profile/PasswordChangeModal";
import type { User } from "../types/user";
import NavigationBar from "../components/NavigationBar";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { getUserAvatar } from "../utils/avatar";

const Container = styled.div`
  background-color: white; /* 배경 흰색으로 변경 */
  min-height: 100vh;
  padding: 2rem;
  padding-bottom: 70px; /* NavigationBar 높이만큼 패딩 추가 */
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #4A4A4A;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Section = styled.div`
  background-color: transparent; /* 섹션 배경 투명하게 변경 */
  border-radius: 0; /* 모서리 둥글기 제거 */
  padding: 1.5rem;
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); */ /* 그림자 제거 */
  margin-bottom: 1.5rem;
  text-align: center; /* 이미지와 텍스트 중앙 정렬을 위해 추가 */
`;

const ProfileImageContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1rem auto; /* 상하 마진 및 좌우 중앙 정렬 */
  border: 3px solid #FF69B4; /* 핑크색 테두리 */
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Nickname = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const UserInfoText = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.3rem;
  strong {
    font-weight: 500;
    color: #FF69B4; /* 핑크 포인트 */
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #4A4A4A; /* 진한 회색으로 변경 */
  font-weight: 600; /* 폰트 두께 추가 (이미 있을 수 있지만 명시) */
  margin-bottom: 1rem;
  /* text-align: left; MyPage 컴포넌트 내에서 Section에 직접 style prop으로 적용 중 */
`;

const SettingsListContainer = styled.div`
  margin-top: 1rem;
`;

const SettingItem = styled.div< { disabled?: boolean } >`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.5rem; /* 상하 패딩, 좌우 약간의 패딩 */
  font-size: 1rem;
  color: ${(props) => (props.disabled ? '#bbb' : '#777')}; /* 비활성화 시 더 연한 회색, 기본은 연한 회색으로 변경 */
  border-bottom: 1px solid #eee; /* 항목 간 구분선 */
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.disabled ? 'transparent' : '#f9f9f9')};
  }

  &:last-child {
    border-bottom: none;
  }

  span { /* 오른쪽 '>' 아이콘을 위한 공간 (실제 아이콘은 ::after로 추가) */
    color: #aaa;
    font-weight: bold;
  }

  /* 실제 아이콘을 사용하려면 라이브러리(예: react-icons)를 사용하거나 SVG를 직접 넣는 것이 좋습니다. */
  /* 여기서는 간단히 텍스트로 처리합니다. */
`;

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // 토큰 체크는 Zustand의 accessToken 사용
  const accessToken = useAuthStore((state) => state.accessToken);
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [navigate, accessToken]);

  const confirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false); // 모달 닫기
    navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
  };

  const handleUpdateSuccess = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (!user) {
    return null;
  }

  const openProfileEditModal = () => {
    setIsEditModalOpen(true);
  };

  const openPasswordChangeModal = () => {
    setIsPasswordModalOpen(true);
  };

  const goToDeleteAccountPage = () => {
    navigate('/delete-account'); // 추후 실제 경로로 수정
  };

  return (
    <>
      <Container>
        <Title>마이 페이지</Title>
        <Section>
          <ProfileImageContainer>
            <img 
              src={user?.profileImageUrl || getUserAvatar(user)} 
              alt={user?.nickname} 
            />
          </ProfileImageContainer>
          <Nickname>{user?.nickname}</Nickname>
          <UserInfoText>{user?.email}</UserInfoText>
          <UserInfoText>
            <strong>연결된 파트너:</strong> {user?.partner?.nickname || '없음'}
          </UserInfoText>
          <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.2rem', justifyContent: 'center' }}>
            <button
              style={{
                background: '#4a6cf7', color: 'white', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', minWidth: 80
              }}
              onClick={() => navigate('/agreement')}
            >
              🤝 합의서
            </button>
            <button
              style={{
                background: '#6b8afd', color: 'white', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', minWidth: 80
              }}
              onClick={() => navigate('/track')}
            >
              📊 트랙
            </button>
            <button
              style={{
                background: '#f7b731', color: 'white', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', minWidth: 80
              }}
              onClick={() => navigate('/point')}
            >
              🪙 포인트
            </button>
            <button
              style={{
                background: '#00b894', color: 'white', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', minWidth: 80
              }}
              onClick={() => navigate('/subscribe')}
            >
              💳 구독
            </button>
          </div>
        </Section>

        <Section style={{ textAlign: 'left' }}> {/* 설정 섹션은 내부 텍스트 왼쪽 정렬 */}
          <SectionTitle>설정</SectionTitle>
          <SettingsListContainer>
            <SettingItem onClick={openProfileEditModal}>
              프로필 설정
              <span>▸</span>
            </SettingItem>
            <SettingItem onClick={openPasswordChangeModal}>
              비밀번호 변경
              <span>▸</span>
            </SettingItem>
            <SettingItem onClick={() => alert("아직 준비 중인 기능입니다.")}>
              알림 설정
              <span>▸</span>
            </SettingItem>
            <SettingItem onClick={() => setIsLogoutModalOpen(true)}>
              로그아웃
              <span>▸</span>
            </SettingItem>
            <SettingItem onClick={goToDeleteAccountPage}>
              회원탈퇴
              <span>▸</span>
            </SettingItem>
          </SettingsListContainer>
        </Section>

        <Section style={{ textAlign: 'left' }}> {/* 고객지원 섹션도 내부 텍스트 왼쪽 정렬 */}
          <SectionTitle>고객지원</SectionTitle>
          <SettingsListContainer>
            <SettingItem onClick={() => navigate('/support/faq')}>
              자주하는 질문
              <span>▸</span>
            </SettingItem>
            <SettingItem onClick={() => navigate('/support/contact')}>
              고객센터
              <span>▸</span>
            </SettingItem>
            <SettingItem onClick={() => navigate('/terms')}>
              서비스 이용약관
              <span>▸</span>
            </SettingItem>
            <SettingItem onClick={() => navigate('/legal/privacy')}>
              개인정보처리방침
              <span>▸</span>
            </SettingItem>
            <SettingItem onClick={() => navigate('/legal/third-party-consent')}>
              개인정보 제 3자 제공 동의
              <span>▸</span>
            </SettingItem>
            <SettingItem onClick={() => navigate('/announcements')}>
              공지사항
              <span>▸</span>
            </SettingItem>
          </SettingsListContainer>
        </Section>

      </Container>
      <NavigationBar />
      {isEditModalOpen && user && (
        <ProfileEditModal
          user={user as User}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {isPasswordModalOpen && (
        <PasswordChangeModal 
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onRequestClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        message="정말로 로그아웃 하시겠습니까?"
        confirmButtonText="로그아웃"
      />
    </>
  );
};

export default MyPage;