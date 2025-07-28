// 구글 로그인 URL 생성
export const getGoogleLoginUrl = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  
  const scope = encodeURIComponent('email profile');
  const responseType = 'code';
  
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
};

// Apple ID 로그인 초기화
export const initializeAppleSignIn = () => {
  if (typeof window !== 'undefined' && window.AppleID) {
    try {
      // Apple ID가 이미 초기화되어 있는지 확인
      if (window.AppleID.auth) {
        return window.AppleID;
      }
      
      // 환경 변수가 설정되지 않은 경우 초기화 건너뛰기
      const clientId = import.meta.env.VITE_APPLE_CLIENT_ID;
      const redirectURI = import.meta.env.VITE_APPLE_REDIRECT_URI;
      
      if (!clientId || !redirectURI) {
        console.warn('Apple ID 로그인 환경 변수가 설정되지 않았습니다.');
        return null;
      }
      
      // Apple ID 초기화 (이미 HTML에서 초기화됨)
      return window.AppleID;
    } catch (error) {
      console.error('Apple ID 초기화 실패:', error);
      return null;
    }
  }
  return null;
};

// Apple ID 로그인 실행
export const signInWithApple = async (): Promise<{
  idToken: string;
  authorizationCode?: string;
  user?: string;
}> => {
  return new Promise((resolve, reject) => {
    const AppleID = initializeAppleSignIn();
    
    if (!AppleID) {
      reject(new Error('Apple ID 로그인이 현재 설정되지 않았습니다.'));
      return;
    }

    AppleID.auth.signIn().then((response: any) => {
      resolve({
        idToken: response.authorization.id_token,
        authorizationCode: response.authorization.code,
        user: response.user ? JSON.stringify(response.user) : undefined,
      });
    }).catch((error: any) => {
      console.error('Apple ID 로그인 실패:', error);
      reject(error);
    });
  });
};

// 카카오 로그인 URL 생성
export const getKakaoLoginUrl = () => {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  
  return `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
};

// 카카오 회원가입 URL 생성
export const getKakaoRegisterUrl = () => {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_KAKAO_REGISTER_REDIRECT_URI;
  
  return `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
}; 