import React, { useState } from 'react';
import styled from 'styled-components';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';
import { ReactComponent as CloseEye } from '../../assets/Icon_CloseEye.svg';
import { ReactComponent as OpenEye } from '../../assets/Icon_OpenEye.svg';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onPasswordChanged?: () => void; // 성공 시 추가 액션이 필요하다면
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 450px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
  &:hover {
    color: #333;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.3rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #FF69B4; 
  }
`;

const HelperText = styled.p`
  font-size: 0.8rem;
  color: #777;
  margin-top: 0.2rem;
`;

const ErrorMessage = styled.div`
  color: #e53e3e; 
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const StyledButton = styled.button`
  padding: 0.7rem 1.2rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, opacity 0.2s;

  &.primary {
    background: linear-gradient(to right, #FF69B4, #4169E1);
    color: white;
    border: none;
    &:hover {
      opacity: 0.9;
    }
  }

  &.secondary {
    background-color: #f0f0f0;
    color: #555;
    border: 1px solid #ddd;
    &:hover {
      background-color: #e0e0e0;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 60%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  svg {
    width: 100%;
    height: 100%;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  &:hover svg {
    opacity: 0.8;
  }
`;

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setIsSubmitting(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };
  
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
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        handleClose();
        // if (onPasswordChanged) onPasswordChanged(); 
      } else {
        setError(response.error?.message || '비밀번호 변경에 실패했습니다.');
        toast.error(response.error?.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err) {
      setError('비밀번호 변경 중 오류가 발생했습니다.');
      toast.error('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 모달이 닫힐 때 폼 상태 초기화
  React.useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <Title>비밀번호 변경</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup style={{ position: 'relative' }}>
            <Label htmlFor="currentPassword">현재 비밀번호</Label>
            <Input
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <PasswordToggle type="button" onClick={() => setShowCurrentPassword(v => !v)} tabIndex={-1}>
              {showCurrentPassword ? <OpenEye /> : <CloseEye />}
            </PasswordToggle>
          </InputGroup>

          <InputGroup style={{ position: 'relative' }}>
            <Label htmlFor="newPassword">새 비밀번호</Label>
            <Input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <PasswordToggle type="button" onClick={() => setShowNewPassword(v => !v)} tabIndex={-1}>
              {showNewPassword ? <OpenEye /> : <CloseEye />}
            </PasswordToggle>
            <HelperText>
              8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.
            </HelperText>
          </InputGroup>

          <InputGroup style={{ position: 'relative' }}>
            <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <PasswordToggle type="button" onClick={() => setShowConfirmPassword(v => !v)} tabIndex={-1}>
              {showConfirmPassword ? <OpenEye /> : <CloseEye />}
            </PasswordToggle>
          </InputGroup>

          {error && (
            <ErrorMessage>{error}</ErrorMessage>
          )}

          <ButtonContainer>
            <StyledButton type="button" className="secondary" onClick={handleClose}>
              취소
            </StyledButton>
            <StyledButton type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? '변경 중...' : '변경하기'}
            </StyledButton>
          </ButtonContainer>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}; 