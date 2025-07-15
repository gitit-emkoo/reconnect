import { z } from 'zod';

// 로그인 폼 유효성 검사 스키마
export const loginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string()
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
    .regex(/[A-Z]/, '비밀번호는 하나 이상의 대문자를 포함해야 합니다.')
    .regex(/[a-z]/, '비밀번호는 하나 이상의 소문자를 포함해야 합니다.')
    .regex(/[0-9]/, '비밀번호는 하나 이상의 숫자를 포함해야 합니다.')
    .regex(/[^A-Za-z0-9]/, '비밀번호는 하나 이상의 특수문자를 포함해야 합니다.'),
});

// 회원가입 폼 유효성 검사 스키마
export const registerSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  nickname: z.string().min(2, '닉네임은 2자 이상이어야 합니다.')
                      .max(10, '닉네임은 10자 이하여야 합니다.'),
  password: z.string()
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
    .regex(/[A-Z]/, '비밀번호는 하나 이상의 대문자를 포함해야 합니다.')
    .regex(/[a-z]/, '비밀번호는 하나 이상의 소문자를 포함해야 합니다.')
    .regex(/[0-9]/, '비밀번호는 하나 이상의 숫자를 포함해야 합니다.')
    .regex(/[^A-Za-z0-9]/, '비밀번호는 하나 이상의 특수문자를 포함해야 합니다.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'], // 에러 메시지를 표시할 필드
});

// 타입 추론
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export const contentSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  // ... existing code ...
});