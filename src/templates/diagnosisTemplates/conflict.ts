import { DiagnosisTemplate } from './types';

const conflict: DiagnosisTemplate = {
  id: 'conflict',
  title: '갈등 회피 진단',
  subtitle: '갈등 상황에서의 회피 및 대처 패턴을 점검합니다.',
  price: '유료',
  questions: [
    // ... (conflict 진단 질문들 복사)
  ],
  calculateScore: (answers: number[]) => answers.reduce((acc, cur) => acc + cur, 0),
  getResultMessage: (score: number) => {
    if (score >= 70) return '갈등 회피가 적은 편입니다.';
    if (score >= 50) return '갈등 회피가 보통입니다.';
    return '갈등 회피 개선이 필요합니다.';
  },
};

export default conflict; 