# 리커넥트 (Reconnect) 앱

부부 사이의 감정 거리 회복을 위한 감정 공유 & 리포트 기반 웹 애플리케이션입니다.

---

## 💡 주요 기능

* 감정 진단: 간단한 질문을 통해 관계 상태 측정
* 감정카드 작성: 감정을 AI가 정리한 말투로 전송
* 감정 일기: 하루의 감정을 기록하고 파트너에게 공유
* 연결 미션: 함께 수행하는 소소한 행동 챌린지
* 관계 리포트: 감정 공유/미션 이행률/온도 분석
* 콘텐츠 센터: 섹스리스, 스킨십 등 개선 콘텐츠 제공
* 파트너 초대 및 연결 기능 지원

---

## 🛠️ 기술 스택

* React (with TypeScript)
* React Router DOM
* styled-components
* Vite

---

## 📁 폴더 구조

```
src/
├── pages/            # 주요 화면 페이지 컴포넌트
├── styles/           # 전역 스타일 및 테마
│   └── GlobalStyle.ts
├── App.tsx           # 라우팅 설정 및 GlobalStyle 적용
├── index.tsx         # 진입점
```

---

## 📦 설치 라이브러리

```bash
npm install react-router-dom styled-components
npm install --save-dev @types/react-router-dom @types/styled-components
```

---

## 🚀 실행 방법

```bash
npm install
npm start
```

---

## ✨ 추후 확장 예정

* GPT API 연동 (감정 메시지 추천)
* Firebase 기반 유저 인증 및 DB 연동
* 감정 상태 전역 저장 (Context API 또는 Zustand)

---

> 본 프로젝트는 감정 표현이 어려운 부부를 위한 ‘부드러운 관계 개선’을 목표로 기획되었습니다.
