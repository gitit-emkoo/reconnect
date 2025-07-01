import { DiagnosisTemplate } from './types';

const communication: DiagnosisTemplate = {
  id: 'communication',
  title: '의사소통 패턴 진단',
  subtitle: '관계 내 의사소통 패턴과 문제점을 점검합니다.',
  price: '50,000',
  questions: [
    // ... (communication 진단 질문들 복사)
  ],
  calculateScore: (answers: number[]) => answers.reduce((acc, cur) => acc + cur, 0),
  getResultMessage: (score: number) => {
    if (score >= 70) return '의사소통이 원활한 편입니다.';
    if (score >= 50) return '의사소통이 보통입니다.';
    return '의사소통 개선이 필요합니다.';
  },
};

export default communication; 