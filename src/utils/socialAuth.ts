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
        console.log('Apple ID 이미 초기화됨');
        return window.AppleID;
      }
      
      // HTML에서 설정된 메타 태그 사용 (환경변수 대신)
      const clientId = 'com.reconnect.kwcc.web'; // HTML에서 설정된 값
      const redirectURI = 'https://reconnect-ivory.vercel.app/auth/apple/callback'; // HTML에서 설정된 값
      
      console.log('Apple ID 초기화 시도:', { clientId, redirectURI });
      
      // Apple ID 초기화 (HTML에서 이미 설정됨)
      return window.AppleID;
    } catch (error) {
      console.error('Apple ID 초기화 실패:', error);
      return null;
    }
  }
  console.warn('Apple ID 스크립트가 로드되지 않았습니다.');
  return null;
};

// Apple ID 로그인 실행
export const signInWithApple = async (): Promise<{
  idToken: string;
  authorizationCode?: string;
  user?: string;
}> => {
  return new Promise((resolve, reject) => {
    console.log('Apple 로그인 시작');
    const AppleID = initializeAppleSignIn();
    
    if (!AppleID) {
      console.error('Apple ID 초기화 실패');
      reject(new Error('Apple ID 로그인이 현재 설정되지 않았습니다.'));
      return;
    }

    console.log('Apple ID 로그인 시도');
    AppleID.auth.signIn().then((response: any) => {
      console.log('Apple 로그인 성공:', response);
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