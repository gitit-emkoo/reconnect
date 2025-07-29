# ReConnect Frontend (리커넥트 프론트엔드)

## 🎯 프로젝트 소개
ReConnect는 부부/연인 관계 개선을 위한 종합 웹 애플리케이션입니다. 과학적인 관계 진단, 감정 교류, 전문가 상담 등 다양한 기능을 통해 더 깊고 건강한 관계를 만들어나갈 수 있도록 지원합니다.

## ✅ 완성된 기능

### 🔍 핵심 기능
- **관계 진단**: 과학적 기반의 관계 상태 진단 및 분석
- **감정 일기**: 일일 감정 기록 및 변화 추이 분석
- **커뮤니티**: 익명 게시판을 통한 사용자 간 소통
- **전문가 상담**: 전문 상담사 연결 및 1:1 상담 서비스
- **콘텐츠 센터**: 관계 개선 관련 전문 콘텐츠 제공
- **합의서 서명**: 디지털 합의서 작성 및 인증

### 🔐 인증 시스템
- **소셜 로그인**: 카카오, 애플, 구글 OAuth 지원
- **JWT 토큰**: 안전한 인증 및 세션 관리
- **자동 로그인**: 사용자 편의성 향상

### 📱 UI/UX
- **반응형 디자인**: 모든 디바이스 최적화
- **모바일 우선**: 모바일 사용자 경험 최적화
- **웹뷰 지원**: 네이티브 앱에서의 최적화된 표시
- **접근성**: 다양한 사용자를 위한 접근성 고려

## 🛠 기술 스택

### Core
- **React 18**: 최신 React 기능 활용
- **TypeScript**: 타입 안정성 보장
- **Vite**: 빠른 개발 및 빌드 환경

### Styling & UI
- **Styled Components**: CSS-in-JS 스타일링
- **CSS Variables**: 동적 테마 및 반응형 지원
- **Responsive Design**: 모든 화면 크기 대응

### State Management
- **Zustand**: 가벼운 상태 관리
- **React Query**: 서버 상태 관리 및 캐싱

### Routing & Navigation
- **React Router v6**: 클라이언트 사이드 라우팅
- **Navigation Guards**: 인증 기반 라우트 보호

### HTTP & API
- **Axios**: HTTP 클라이언트
- **Interceptors**: 요청/응답 인터셉터

### Development Tools
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Sentry**: 에러 모니터링

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone https://github.com/gitit-emkoo/reconnect.git
cd reconnect/reconnect
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 빌드
```bash
npm run build
```

## 📁 프로젝트 구조

```
reconnect/
├── src/
│   ├── assets/           # 이미지, 아이콘, 폰트 등
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── common/       # 공통 컴포넌트
│   │   ├── agreement/    # 합의서 관련 컴포넌트
│   │   ├── contents/     # 콘텐츠 관련 컴포넌트
│   │   ├── emotioncard/  # 감정 카드 컴포넌트
│   │   └── Profile/      # 프로필 관련 컴포넌트
│   ├── pages/           # 페이지 컴포넌트
│   ├── store/           # Zustand 상태 관리
│   ├── styles/          # 전역 스타일 및 테마
│   ├── types/           # TypeScript 타입 정의
│   ├── utils/           # 유틸리티 함수
│   └── App.tsx          # 메인 앱 컴포넌트
├── public/              # 정적 파일
├── index.html           # HTML 템플릿
└── package.json         # 프로젝트 설정
```

## 🎨 스타일 가이드

### 글씨 크기 시스템
- **전역 축소율**: 5% (`--font-size-scale: 0.95`)
- **네비게이션**: `0.8rem` ~ `0.9rem`
- **버튼**: `0.9rem` ~ `1rem`
- **입력 필드**: `1rem`
- **카드 제목**: `1.1rem`
- **카드 내용**: `0.9rem`

자세한 내용은 `FONT_SIZE_GUIDE.md`를 참고하세요.

### 색상 팔레트
- **Primary**: `#785CD2` (보라색)
- **Secondary**: `#FF69B4` (핑크색)
- **Background**: `#fafafa` (연한 회색)
- **Text**: `#333333` (진한 회색)

## 📱 반응형 지원

### 브레이크포인트
- **Mobile**: `max-width: 768px`
- **Tablet**: `min-width: 769px and max-width: 1024px`
- **Desktop**: `min-width: 1025px`

### 웹뷰 최적화
- **Safe Area**: iOS/Android 안전 영역 지원
- **Viewport**: 동적 뷰포트 높이 계산
- **Touch**: 터치 인터랙션 최적화

## 🔧 개발 가이드

### 컴포넌트 작성 규칙
```tsx
// 1. TypeScript 인터페이스 정의
interface ComponentProps {
  title: string;
  onClick?: () => void;
}

// 2. Styled Components 사용
const StyledComponent = styled.div`
  // 스타일 정의
`;

// 3. React.memo로 최적화
const Component: React.FC<ComponentProps> = React.memo(({ title, onClick }) => {
  return (
    <StyledComponent onClick={onClick}>
      {title}
    </StyledComponent>
  );
});
```

### 상태 관리
```tsx
// Zustand 스토어 사용
import useAuthStore from '../store/authStore';

const Component = () => {
  const { user, login, logout } = useAuthStore();
  
  return (
    // 컴포넌트 내용
  );
};
```

## 🚀 배포

### Vercel 배포
- **URL**: https://reconnect-ivory.vercel.app
- **자동 배포**: main 브랜치 푸시 시 자동 배포
- **환경 변수**: Vercel 대시보드에서 설정

### 환경별 설정
- **Development**: `http://localhost:3000/api`
- **Production**: `https://reconnect-backend.onrender.com`

## 🐛 문제 해결

### 일반적인 이슈
1. **CORS 에러**: 백엔드 서버가 실행 중인지 확인
2. **환경 변수**: `.env.local` 파일이 올바르게 설정되었는지 확인
3. **포트 충돌**: 다른 프로세스가 5173 포트를 사용 중인지 확인

### 디버깅
```bash
# 개발 모드에서 디버깅
npm run dev

# 빌드 분석
npm run build
npm run preview
```

## 📊 성능 최적화

### 이미지 최적화
- **WebP 포맷**: 최신 브라우저 지원
- **Lazy Loading**: 스크롤 시 이미지 로드
- **Responsive Images**: 화면 크기별 최적화

### 코드 스플리팅
- **React.lazy**: 컴포넌트 지연 로딩
- **Route-based**: 페이지별 코드 분할

## 🤝 기여하기

이 프로젝트는 현재 유지보수 및 개선 단계입니다. 버그 리포트나 개선 제안은 이슈를 통해 제출해주세요.

## 📄 라이선스

© 2024 ReConnect. All Rights Reserved.
