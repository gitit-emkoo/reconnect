import { DiagnosisTemplate } from './types';

const depression: DiagnosisTemplate = {
  id: 'depression',
  title: '우울감 진단',
  subtitle: '정서적 안정감과 우울감 수준을 점검합니다.',
  price: '유료',
  questions: [
    // ... (depression 진단 질문들 복사)
  ],
  calculateScore: (answers: number[]) => answers.reduce((acc, cur) => acc + cur, 0),
  getResultMessage: (score: number) => {
    if (score >= 70) return '우울감이 낮은 편입니다.';
    if (score >= 50) return '우울감이 보통입니다.';
    return '우울감 관리가 필요합니다.';
  },
};

export default depression; 