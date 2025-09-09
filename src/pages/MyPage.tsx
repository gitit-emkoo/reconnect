import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container as BaseContainer } from '../styles/CommonStyles';
import { useNavigate } from "react-router-dom";
import useAuthStore from '../store/authStore';
import { ProfileEditModal } from "../components/Profile/ProfileEditModal";
import { PasswordChangeModal } from "../components/Profile/PasswordChangeModal";
import type { User } from "../types/user";
import NavigationBar from "../components/NavigationBar";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { getUserAvatar } from "../utils/avatar";
import { ADMIN_CONFIG } from '../config/admin';
import { blockApi } from '../api/user';
import IconPoint from "../assets/Icon_Point.png";
import IconTrack from "../assets/Icon_Track.png";
import IconSubscribe from "../assets/Icon_Subscribe.png";
// import EventBannerModal from "../components/common/EventBannerModal";
import NotificationSettingsSheet from '../components/common/NotificationSettingsSheet';

const Container = styled(BaseContainer)`
  background-color: white; 
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #4A4A4A;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Section = styled.div`
  background-color: transparent; 
  padding: 0.4rem;
  border-radius: 0; 
  text-align: center; 
`;

const ProfileImageContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1rem auto;  
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
    color: #FF69B4; 
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #4A4A4A; 
  font-weight: 600; 
  margin-bottom: 1rem;
  
`;

const SettingsListContainer = styled.div`
  margin-top: 1rem;
`;

const SettingItem = styled.div< { disabled?: boolean } >`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.5rem; 
  font-size: 1rem;
  color: ${(props) => (props.disabled ? '#bbb' : '#777')}; 
  border-bottom: 1px solid #eee; 
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.disabled ? 'transparent' : '#f9f9f9')};
  }

  &:last-child {
    border-bottom: none;
  }

  span { 
    color: #aaa;
    font-weight: bold;
  }

`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0.5rem; 
  font-size: 0.9rem;
  color: #777; 
  border-bottom: 1px solid #eee; 

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 500;
    color: #555;
  }

  .value {
    color: #999;
    font-size: 0.7rem;
  }
`;

const CompanyInfoContent = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem 0;
`;

const InfoSection = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;


const ModalSectionTitle = styled.h4`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.8rem;
  font-weight: 600;
`;

const MenuButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #4A4A4A;
  border: none;
  padding: 0.8rem;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  min-width: 70px;
  min-height: 70px;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    color: #FF69B4;
  }

  img {
    width: 32px;
    height: 32px;
    margin-bottom: 0.5rem;
    filter: none;
    transition: all 0.2s ease-in-out;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const MenuContainer = styled.div`
  background-color: rgb(249, 249, 249);
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0 0.5rem;
  margin-top: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  width: 100%;

`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  justify-items: center;
  width: 100%;
`;

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isCompanyInfoModalOpen, setIsCompanyInfoModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<Array<{ id: string; nickname: string; email: string; profileImageUrl?: string }>>([]);
  const [isNotificationSheetOpen, setIsNotificationSheetOpen] = useState(false);
  

  // 토큰 체크는 Zustand의 accessToken 사용
  const accessToken = useAuthStore((state) => state.accessToken);
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [navigate, accessToken]);

  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const list = await blockApi.getMyBlocks();
        setBlockedUsers(list);
      } catch {}
    };
    if (accessToken) {
      loadBlocks();
    }
  }, [accessToken]);

  

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
          <MenuContainer>
            <MenuGrid>
              <MenuButton onClick={() => navigate('/track')}>
                <img src={IconTrack} alt="트랙" />
                감정트랙
              </MenuButton>
              <MenuButton onClick={() => navigate('/point')}>
                <img src={IconPoint} alt="포인트" />
                ReCoin
              </MenuButton>
              <MenuButton onClick={() => navigate('/subscribe')}>
                <img src={IconSubscribe} alt="구독" />
                구독관리
              </MenuButton>
            </MenuGrid>
          </MenuContainer>
        </Section>

        {/* 이벤트 배너 */}
        <Section>
          <img
            src="/images/eventBanner.png"
            alt="이벤트 배너"
            style={{ width: '100%', borderRadius: 12, cursor: 'pointer' }}
            onClick={() => setIsEventModalOpen(true)}
          />
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
            <SettingItem onClick={() => setIsNotificationSheetOpen(true)}>
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

        {/* 차단 사용자 관리는 전용 페이지로 이동 */}
        <Section style={{ textAlign: 'left' }}>
          <SettingItem onClick={() => navigate('/blocked-users')}>
            차단 사용자 관리
            <span style={{ color: '#785cd2', background: '#f3f0ff', borderRadius: 999, padding: '2px 8px', fontSize: '0.8rem' }}>{blockedUsers.length}</span>
          </SettingItem>
        </Section>

        {/* 관리자 메뉴 - 관리자인 경우에만 표시 */}
        {user && (() => {
          const isAdmin = ADMIN_CONFIG.isAdmin(user.email, user.role);
          console.log('관리자 권한 체크:', {
            email: user.email,
            role: user.role,
            isAdmin: isAdmin
          });
          return isAdmin;
        })() && (
          <Section style={{ textAlign: 'left' }}>
            <SectionTitle>관리자</SectionTitle>
            <SettingsListContainer>
              <SettingItem onClick={() => navigate('/user-admin')}>
                유저 관리
                <span>▸</span>
              </SettingItem>
              <SettingItem onClick={() => navigate('/content-admin')}>
                콘텐츠 관리
                <span>▸</span>
              </SettingItem>
              <SettingItem onClick={() => navigate('/community-admin')}>
                커뮤니티 관리
                <span>▸</span>
              </SettingItem>
              <SettingItem onClick={() => navigate('/event-entries')}>
                이벤트 참여 내역
                <span>▸</span>
              </SettingItem>
            </SettingsListContainer>
          </Section>
        )}

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
            <SettingItem onClick={() => setIsCompanyInfoModalOpen(true)}>
              사업자/앱정보
              <span>▸</span>
            </SettingItem>
          </SettingsListContainer>
        </Section>

      </Container>
      <NavigationBar />
      <NotificationSettingsSheet open={isNotificationSheetOpen} onClose={() => setIsNotificationSheetOpen(false)} />
      {/* 임시 이벤트 안내 모달 */}
      <ConfirmationModal
        isOpen={isEventModalOpen}
        onRequestClose={() => setIsEventModalOpen(false)}
        onConfirm={() => setIsEventModalOpen(false)}
        title="이벤트 안내"
        message="경품 이벤트가 곧 시작됩니다. 이벤트 시작은 PUSH로 알려드립니다."
        confirmButtonText="확인"
        showCancelButton={false}
      />
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

      {/* 사업자/앱정보 모달 */}
      <ConfirmationModal
        isOpen={isCompanyInfoModalOpen}
        onRequestClose={() => setIsCompanyInfoModalOpen(false)}
        onConfirm={() => setIsCompanyInfoModalOpen(false)}
        message=""
        confirmButtonText="확인"
        showCancelButton={false}
      >
        <CompanyInfoContent>
          <InfoSection>
            <ModalSectionTitle>사업자 정보</ModalSectionTitle>
            <InfoItem>
              <span className="label">회사명</span>
              <span className="value">KWCC(주)</span>
            </InfoItem>
            <InfoItem>
              <span className="label">대표자</span>
              <span className="value">구은모</span>
            </InfoItem>
            <InfoItem>
              <span className="label">사업자등록번호</span>
              <span className="value">849-81-02606</span>
            </InfoItem>
            <InfoItem>
              <span className="label">주소</span>
              <span className="value">화성시 동탄대로 646-2, 907호</span>
            </InfoItem>
            <InfoItem>
              <span className="label">연락처</span>
              <span className="value">0507-8638-0682</span>
            </InfoItem>
            <InfoItem>
              <span className="label">이메일</span>
              <span className="value">cokwcc@gmail.com</span>
            </InfoItem>
            <InfoItem>
              <span className="label">통신판매업</span>
              <span className="value">2023-화성동탄-1793호</span>
            </InfoItem>
          </InfoSection>
          
          <InfoSection>
            <ModalSectionTitle>앱 정보</ModalSectionTitle>
            <InfoItem>
              <span className="label">앱 버전</span>
              <span className="value">1.0.0</span>
            </InfoItem>
            <InfoItem>
              <span className="label">개발사</span>
              <span className="value">KWCC(주)</span>
            </InfoItem>
          </InfoSection>
        </CompanyInfoContent>
      </ConfirmationModal>
    </>
  );
};

export default MyPage;