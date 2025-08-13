import { DiagnosisTemplate } from './types';

const affection: DiagnosisTemplate = {
  id: 'affection',
  title: '정서적 애정결핍 진단',
  subtitle: '정서적 친밀감과 애정결핍 정도를 점검합니다.',
  price: '이벤트 무료오픈',
  questions: [
    // ... (affection 진단 질문들 복사)
  ],
  calculateScore: (answers: number[]) => answers.reduce((acc, cur) => acc + cur, 0),
  getResultMessage: (score: number) => {
    if (score >= 70) return '정서적 애정결핍이 낮은 편입니다.';
    if (score >= 50) return '정서적 애정결핍이 보통입니다.';
    return '정서적 애정결핍 관리가 필요합니다.';
  },
};

export default affection; 