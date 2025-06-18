# ReConnect (리커넥트)

## 프로젝트 소개
ReConnect는 부부/연인 관계 개선을 위한 웹 애플리케이션입니다. 관계 온도 측정, 감정 카드 교환, 감정 일기 작성 등 다양한 기능을 통해 서로의 마음을 이해하고 소통할 수 있도록 도와줍니다.

## 주요 기능
- **관계 온도 테스트**: 현재 관계의 상태를 진단
- **감정 카드**: 서로의 감정을 카드로 표현하고 교환
- **감정 일기**: 일상의 감정을 기록
- **Daily Thought**: 매일의 생각을 공유
- **혼자/함께 모드**: 상황에 맞는 맞춤형 기능 제공

## 기술 스택
- React
- TypeScript
- Vite
- Styled-components
- React Router DOM

## 시작하기

### 1. 의존성 설치
```bash
# 저장소 클론
git clone https://github.com/gitit-emkoo/reconnect.git

# 디렉토리 이동
cd reconnect

# 의존성 설치
npm install
```

### 2. 환경 변수 설정
로컬 개발 환경에서 백엔드 API와 통신하기 위해, 프로젝트 루트 디렉토리(`reconnect/`)에 `.env.local` 파일을 생성하고 아래와 같이 API 서버 주소를 설정해야 합니다.

```env
# 백엔드 개발 서버 주소
VITE_API_URL=http://localhost:3000/api
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

## 브랜치 관리
- `main`: 안정적인 배포 버전
- `develop`: 개발 중인 기능

## 프로젝트 구조
```
reconnect/
├── src/
│   ├── assets/         # 이미지, 아이콘 등 정적 파일
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── pages/         # 페이지 컴포넌트
│   ├── styles/        # 전역 스타일
│   └── types/         # TypeScript 타입 정의
├── public/            # 정적 파일
└── package.json       # 프로젝트 설정 및 의존성
```

## 개발 현황
현재 개발 진행 중인 프로젝트입니다. 추가 기능과 개선사항은 지속적으로 업데이트될 예정입니다.

© 2024 ReConnect. All Rights Reserved.
