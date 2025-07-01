import { DiagnosisTemplate } from './types';

const stress: DiagnosisTemplate = {
  id: 'stress',
  title: '스트레스 진단',
  subtitle: '일상 및 관계에서의 스트레스 수준을 점검합니다.',
  price: '50,000',
  questions: [
    // ... (stress 진단 질문들 복사)
  ],
  calculateScore: (answers: number[]) => answers.reduce((acc, cur) => acc + cur, 0),
  getResultMessage: (score: number) => {
    if (score >= 70) return '스트레스가 낮은 편입니다.';
    if (score >= 50) return '스트레스가 보통입니다.';
    return '스트레스 관리가 필요합니다.';
  },
};

export default stress; 