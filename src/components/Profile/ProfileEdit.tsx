import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import type { User } from '../../types/user';
import { toast } from 'react-toastify';

interface ProfileEditProps {
  user: User;
  onUpdateSuccess: (updatedUser: User) => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({ user, onUpdateSuccess }) => {
  const [nickname, setNickname] = useState(user.nickname);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (nickname.trim() === user.nickname) {
      setError('변경된 내용이 없습니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await userService.updateProfile(nickname.trim());

      if (response.success && response.data) {
        onUpdateSuccess(response.data);
        toast.success('프로필이 성공적으로 수정되었습니다.');
      } else {
        setError(response.error?.message || '프로필 수정에 실패했습니다.');
        toast.error(response.error?.message || '프로필 수정에 실패했습니다.');
      }
    } catch (error) {
      setError('프로필 수정 중 오류가 발생했습니다.');
      toast.error('프로필 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">프로필 수정</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
          </button>
        </div>
      </form>
    </div>
  );
}; 