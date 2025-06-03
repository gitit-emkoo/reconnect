import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';

export const PasswordChange: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return false;
    }

    if (currentPassword === newPassword) {
      setError('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('비밀번호는 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await userService.changePassword({
        currentPassword,
        newPassword
      });

      if (response.success) {
        toast.success('비밀번호가 성공적으로 변경되었습니다.');
        navigate(-1);
      } else {
        setError(response.error?.message || '비밀번호 변경에 실패했습니다.');
        toast.error(response.error?.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      setError('비밀번호 변경 중 오류가 발생했습니다.');
      toast.error('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">비밀번호 변경</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            현재 비밀번호
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            새 비밀번호
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            새 비밀번호 확인
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            required
          />
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
            {isSubmitting ? '변경 중...' : '변경하기'}
          </button>
        </div>
      </form>
    </div>
  );
}; 