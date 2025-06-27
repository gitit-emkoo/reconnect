// 관리자 설정
export const ADMIN_CONFIG = {
  // 관리자 이메일 목록 (쉼표로 구분)
  ADMIN_EMAILS: ['test@test.com'],
  
  // 관리자 권한 체크 함수
  isAdmin: (email: string, role?: string): boolean => {
    if (role === 'ADMIN') return true;
    return ADMIN_CONFIG.ADMIN_EMAILS.includes(email);
  }
}; 