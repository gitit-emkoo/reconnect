import React from 'react';
import styled, { css } from 'styled-components';

interface SubmitButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // onClick 타입 명시
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset'; // 버튼 타입 추가
  className?: string; // 외부에서 스타일 확장을 위해 className prop 추가
  size?: 'small' | 'medium' | 'large'; // size prop 추가
  width?: string; // width prop 추가
}

// size prop에 따른 스타일 정의
const sizeStyles = {
  small: css`
    padding: 0.5rem 0.8rem;
    font-size: 0.875rem;
  `,
  medium: css`
    padding: 1rem;
    font-size: 1rem;
  `,
  large: css`
    padding: 1.2rem 1.5rem;
    font-size: 1.125rem;
  `,
};

// SubmitButtonStyled에서 실제 사용하는 props만 Pick으로 지정
const SubmitButtonStyled = styled.button<Pick<SubmitButtonProps, 'size' | 'disabled' | 'width'>>`
  font-weight: 500;
  background: linear-gradient(to right, #FF69B4, #4169E1);
  color: white;
  border: none; // BaseButton의 border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s;
  ${({ width }) => width ? `width: ${width};` : 'width: 100%; max-width: 340px;'} // width prop에 따른 조건부 스타일

  ${({ size = 'medium' }) => sizeStyles[size]} // size prop에 따른 스타일 적용

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  ${({ disabled }) => 
    disabled && 
    css`
      background: #cbd5e1;
      color: #94a3b8;
      cursor: not-allowed;
      transform: none;
  `}
`;

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  onClick,
  children,
  disabled = false,
  type = 'button',
  className,
  size = 'medium', // size prop 기본값 설정
  width // width prop 추가
}) => {
  return (
    <SubmitButtonStyled 
      onClick={onClick} 
      disabled={disabled} 
      type={type}
      className={className}
      size={size} // size prop 전달
      width={width} // width prop 전달
    >
      {children}
    </SubmitButtonStyled>
  );
};

export default SubmitButton; 