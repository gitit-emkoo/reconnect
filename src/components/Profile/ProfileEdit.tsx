import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import type { User } from '../../types/user';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { generateAvatar } from '../../utils/avatar';

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

  &:hover {
    transform: scale(1.05);
  }
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

  &:hover {
    transform: scale(1.05);
  }
`;

const ImageUploadButton = styled.button`
  background: #785cd2;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #6a4fc7;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
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

  &:hover {
    background: #e55a9e;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

interface ProfileEditProps {
  user: User;
  onUpdateSuccess: (updatedUser: User) => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({ user, onUpdateSuccess }) => {
  const [nickname, setNickname] = useState(user.nickname);
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl);
  const [originalProfileImageUrl, setOriginalProfileImageUrl] = useState(user.profileImageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    try {
      setIsImageUploading(true);
      
      // 파일을 Base64로 변환
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = e.target?.result as string;
        
        try {
          const response = await userService.updateProfileImage(base64String);
          
          if (response.success && response.data) {
            setProfileImageUrl(base64String);
            setOriginalProfileImageUrl(base64String); // 원본도 업데이트
            onUpdateSuccess(response.data);
            toast.success('프로필 이미지가 성공적으로 업데이트되었습니다.');
          } else {
            toast.error(response.error?.message || '이미지 업로드에 실패했습니다.');
          }
        } catch (error) {
          toast.error('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
          setIsImageUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setIsImageUploading(false);
      toast.error('이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

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
      navigate(-1);
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
    navigate(-1);
  };

  // 변경사항이 있는지 확인
  const hasChanges = nickname.trim() !== user.nickname || profileImageUrl !== originalProfileImageUrl;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">프로필 수정</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProfileImageSection>
          <ProfileImageContainer>
            {profileImageUrl ? (
              <ProfileImage 
                src={profileImageUrl} 
                alt={user.nickname}
                onClick={handleImageClick}
              />
            ) : (
              <DefaultProfileImage onClick={handleImageClick}>
                {user.nickname.charAt(0)}
              </DefaultProfileImage>
            )}
          </ProfileImageContainer>
          <ButtonContainer>
            <ImageUploadButton
              type="button"
              onClick={handleImageClick}
              disabled={isImageUploading}
            >
              {isImageUploading ? '업로드 중...' : '이미지 변경'}
            </ImageUploadButton>
            <RandomAvatarButton
              type="button"
              onClick={handleGenerateRandomAvatar}
              disabled={isImageUploading}
            >
              {isImageUploading ? '생성 중...' : '랜덤 아바타 생성'}
            </RandomAvatarButton>
          </ButtonContainer>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUpload(file);
              }
            }}
          />
        </ProfileImageSection>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            disabled
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600"
          />
        </div>

        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
            닉네임
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            minLength={2}
            maxLength={20}
            required
          />
          <p className="mt-1 text-sm text-gray-500">2-20자 사이로 입력해주세요.</p>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !hasChanges}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
          </button>
        </div>
      </form>
    </div>
  );
}; 