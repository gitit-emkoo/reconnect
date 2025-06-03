// 이메일 유효성 검사
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

// 비밀번호 유효성 검사 (8자 이상, 영문/숫자/특수문자 포함)
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}; 