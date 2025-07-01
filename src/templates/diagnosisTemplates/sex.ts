import { DiagnosisTemplate } from './types';

const sex: DiagnosisTemplate = {
  id: 'sex',
  title: '성생활 만족도 진단',
  subtitle: '성적 친밀감과 만족도를 점검하여 부부관계의 건강성을 확인합니다.',
  price: '유료',
  questions: [
    // ... (sex 진단 질문들 복사)
  ],
  calculateScore: (answers: number[]) => answers.reduce((acc, cur) => acc + cur, 0),
  getResultMessage: (score: number) => {
    if (score >= 70) return '성적 만족도가 높습니다.';
    if (score >= 50) return '성적 만족도가 보통입니다.';
    return '성적 만족도 개선이 필요합니다.';
  },
};

export default sex; 