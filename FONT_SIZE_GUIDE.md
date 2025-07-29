# 📝 글씨 크기 조정 가이드

## 🎯 개요
전체적인 글씨 크기를 5% 축소하여 UI를 더 컴팩트하게 만들었습니다. 중요한 요소들은 적절한 크기를 유지하도록 세밀하게 조정했습니다.

## 📏 기본 설정

### 전역 설정
- **기본 축소율**: 5% (`--font-size-scale: 0.95`)
- **적용 범위**: `body` 요소의 기본 텍스트

### 예외 처리
- **제목 요소** (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`): 원래 크기 유지
- **UI 요소** (`button`, `input`, `select`, `textarea`): 원래 크기 유지

## 🎨 CSS 클래스 사용법

### 1. 네비게이션 텍스트
```css
.nav-text {
  font-size: 0.75rem !important;
}
```
**사용 예시:**
```jsx
<button className="nav-text">Home</button>
```

### 2. 카드 제목
```css
.card-title {
  font-size: 1.1rem !important;
  font-weight: 600;
}
```
**사용 예시:**
```jsx
<div className="card-title">카드 제목</div>
```

### 3. 카드 내용
```css
.card-content {
  font-size: 0.9rem !important;
}
```
**사용 예시:**
```jsx
<div className="card-content">카드 내용 텍스트</div>
```

### 4. 버튼 텍스트
```css
.button-text {
  font-size: 0.9rem !important;
}
```
**사용 예시:**
```jsx
<button className="button-text">버튼</button>
```

### 5. 입력 필드
```css
.input-text {
  font-size: 1rem !important;
}
```
**사용 예시:**
```jsx
<input className="input-text" placeholder="입력하세요" />
```

## 📱 반응형 설정

### 모바일 (768px 이하)
- 네비게이션 텍스트: `0.8rem`
- 버튼 텍스트: `0.9rem`
- 입력 필드: `1rem`

### 작은 화면 (480px 이하)
- 네비게이션 텍스트: `0.85rem`

## 🔧 기존 컴포넌트 수정 방법

### 1. styled-components 사용 시
```jsx
const StyledButton = styled.button`
  font-size: 0.9rem; /* 직접 크기 지정 */
  
  /* 또는 CSS 클래스 사용 */
  &.button-text {
    font-size: 0.9rem !important;
  }
`;
```

### 2. 인라인 스타일 사용 시
```jsx
<button style={{ fontSize: '0.9rem' }}>
  버튼
</button>
```

### 3. CSS 클래스 적용
```jsx
<button className="button-text">
  버튼
</button>
```

## 📋 권장사항

### ✅ 권장하는 크기
- **네비게이션**: `0.8rem` ~ `0.9rem`
- **버튼**: `0.9rem` ~ `1rem`
- **입력 필드**: `1rem`
- **카드 제목**: `1.1rem`
- **카드 내용**: `0.9rem`
- **작은 텍스트**: `0.85rem`

### ❌ 피해야 할 크기
- `0.7rem` 이하: 너무 작아서 가독성 저하
- `1.2rem` 이상: 전체적인 균형 깨짐

## 🎯 특별한 경우

### 1. 매우 중요한 텍스트
```jsx
<h1 style={{ fontSize: 'revert' }}>매우 중요한 제목</h1>
```

### 2. 작은 설명 텍스트
```jsx
<small className="text-sm">작은 설명</small>
```

### 3. 큰 강조 텍스트
```jsx
<div className="text-lg">큰 강조 텍스트</div>
```

## 🔄 변경 사항 적용

변경사항을 적용하려면:

1. **개발 서버 재시작**
```bash
npm run dev
```

2. **브라우저 캐시 삭제**
   - `Ctrl + F5` (Windows)
   - `Cmd + Shift + R` (Mac)

3. **모바일에서 테스트**
   - 다양한 화면 크기에서 확인
   - 네비게이션 텍스트 가독성 체크

## 📊 변경 전후 비교

| 요소 | 변경 전 | 변경 후 | 개선사항 |
|------|---------|---------|----------|
| 기본 텍스트 | 100% | 95% | 5% 축소로 컴팩트 |
| 네비게이션 | 0.75rem | 0.8rem | 가독성 향상 |
| 버튼 | 1rem | 0.9rem | 균형감 개선 |
| 입력 필드 | 1rem | 1rem | 유지 (사용성) |

## 🚀 추가 최적화

더 세밀한 조정이 필요한 경우:

1. **CSS 변수 수정**
```css
:root {
  --font-size-scale: 0.97; /* 더 작은 축소 */
}
```

2. **특정 요소만 조정**
```css
.special-text {
  font-size: calc(1em * 0.9) !important;
}
```

---

**💡 팁**: 변경사항을 적용한 후 실제 디바이스에서 테스트하여 가독성과 사용성을 확인하세요!