import React, { useState } from 'react';
import styled from 'styled-components';
import { userService } from '../../services/userService';
import type { User } from '../../types/user';
import { toast } from 'react-toastify';
import { generateAvatar } from '../../utils/avatar';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #FF69B4;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ProfileImageSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ProfileImageContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover { transform: scale(1.05); }
`;

const DefaultProfileImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 2.5rem;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover { transform: scale(1.05); }
`;

const RandomAvatarButton = styled.button`
  background: #ff69b4;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-left: 0.5rem;
  &:hover { background: #e55a9e; }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  &:focus { outline: none; border-color: #FF69B4; }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
`;

const Button = styled.button<{ $isCancel?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  background: ${props => props.$isCancel ? '#6c757d' : '#FF69B4'};
  color: white;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

interface ProfileEditModalProps {
  user: User;
  onClose: () => void;
  onUpdateSuccess: (updatedUser: User) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  user,
  onClose,
  onUpdateSuccess
}) => {
  const [nickname, setNickname] = useState(user.nickname);
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl);
  const [originalProfileImageUrl] = useState(user.profileImageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateRandomAvatar = () => {
    try {
      setIsImageUploading(true);
      // 클라이언트에서 랜덤 아바타 생성 (미리보기용)
      const randomSeed = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const newAvatarUrl = generateAvatar(randomSeed);
      setProfileImageUrl(newAvatarUrl);
      toast.success('새로운 랜덤 아바타가 생성되었습니다! 저장 버튼을 눌러 변경사항을 저장하세요.');
    } catch (error) {
      toast.error('랜덤 아바타 생성 중 오류가 발생했습니다.');
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 변경사항이 있는지 확인
    const hasNicknameChanged = nickname.trim() !== user.nickname;
    const hasAvatarChanged = profileImageUrl !== originalProfileImageUrl;
    
    if (!hasNicknameChanged && !hasAvatarChanged) {
      setError('변경된 내용이 없습니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 닉네임 변경이 있는 경우
      if (hasNicknameChanged) {
        const nicknameResponse = await userService.updateProfile(nickname.trim());
        if (!nicknameResponse.success) {
          setError(nicknameResponse.error?.message || '닉네임 수정에 실패했습니다.');
          toast.error(nicknameResponse.error?.message || '닉네임 수정에 실패했습니다.');
          return;
        }
      }
      
      // 아바타 변경이 있는 경우
      if (hasAvatarChanged && profileImageUrl) {
        const avatarResponse = await userService.updateProfileImage(profileImageUrl);
        if (!avatarResponse.success) {
          setError(avatarResponse.error?.message || '아바타 수정에 실패했습니다.');
          toast.error(avatarResponse.error?.message || '아바타 수정에 실패했습니다.');
          return;
        }
      }
      
      // 성공 시 업데이트된 사용자 정보 가져오기
      const updatedUser = await userService.getMyProfile();
      onUpdateSuccess(updatedUser);
      toast.success('프로필이 성공적으로 수정되었습니다.');
      onClose();
    } catch (error) {
      setError('프로필 수정 중 오류가 발생했습니다.');
      toast.error('프로필 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // 원본 상태로 되돌리기
    setProfileImageUrl(originalProfileImageUrl);
    setNickname(user.nickname);
    onClose();
  };

  // 변경사항이 있는지 확인
  const hasChanges = nickname.trim() !== user.nickname || profileImageUrl !== originalProfileImageUrl;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>프로필 수정</Title>
        <form onSubmit={handleSubmit}>
          <ProfileImageSection>
            <ProfileImageContainer>
              {profileImageUrl ? (
                <ProfileImage 
                  src={profileImageUrl} 
                  alt={user.nickname}
                />
              ) : (
                <DefaultProfileImage>
                  {user.nickname.charAt(0)}
                </DefaultProfileImage>
              )}
            </ProfileImageContainer>
            <ButtonContainer>
              <RandomAvatarButton
                type="button"
                onClick={handleGenerateRandomAvatar}
                disabled={isImageUploading}
              >
                {isImageUploading ? '생성 중...' : '랜덤 아바타 생성'}
              </RandomAvatarButton>
            </ButtonContainer>
          </ProfileImageSection>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>이메일</label>
            <Input
              type="email"
              id="email"
              value={user.email}
              disabled
            />
          </div>
          <div>
            <label htmlFor="nickname" style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>닉네임</label>
            <Input
              type="text"
              id="nickname"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              minLength={2}
              maxLength={20}
              required
            />
            <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>2-20자 사이로 입력해주세요.</div>
          </div>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ButtonGroup>
            <Button type="submit" disabled={isSubmitting || !hasChanges}>
              {isSubmitting ? '수정 중...' : '저장'}
            </Button>
            <Button type="button" onClick={handleCancel} $isCancel>취소</Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}; 