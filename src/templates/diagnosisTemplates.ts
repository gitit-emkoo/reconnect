export interface DiagnosisQuestion {
  text: string;
  options: { text: string; value: number }[];
}

export interface DiagnosisTemplate {
  id: string;
  title: string;
  description: string;
  questions: DiagnosisQuestion[];
  calculateScore: (answers: number[]) => number;
  getResultMessage: (score: number) => string;
}

export const DIAGNOSIS_TEMPLATES: DiagnosisTemplate[] = [
  {
    id: 'generic-self',
    title: '자기이해 진단',
    description: '나를 얼마나 잘 알고 있는지 확인해보세요.',
    questions: [
      {
        text: '나는 내 감정을 비교적 쉽게 표현하는 편이다.',
        options: [
          { text: '매우 그렇다', value: 5 },
          { text: '그렇다', value: 4 },
          { text: '보통이다', value: 3 },
          { text: '그렇지 않다', value: 2 },
          { text: '전혀 그렇지 않다', value: 1 },
        ],
      },
      {
        text: '나는 혼자만의 시간이 꼭 필요한 사람이다.',
        options: [
          { text: '매우 그렇다', value: 5 },
          { text: '그렇다', value: 4 },
          { text: '보통이다', value: 3 },
          { text: '그렇지 않다', value: 2 },
          { text: '전혀 그렇지 않다', value: 1 },
        ],
      },
      {
        text: '갈등 상황이 생기면 먼저 대화를 시도하려고 한다.',
        options: [
          { text: '매우 그렇다', value: 5 },
          { text: '그렇다', value: 4 },
          { text: '보통이다', value: 3 },
          { text: '그렇지 않다', value: 2 },
          { text: '전혀 그렇지 않다', value: 1 },
        ],
      },
      {
        text: '나는 상대방의 말보다 표정이나 태도에 민감한 편이다.',
        options: [
          { text: '매우 그렇다', value: 5 },
          { text: '그렇다', value: 4 },
          { text: '보통이다', value: 3 },
          { text: '그렇지 않다', value: 2 },
          { text: '전혀 그렇지 않다', value: 1 },
        ],
      },
      {
        text: '감정이 상해도 그 자리에서는 표현하지 않는 편이다. (역채점)',
        options: [
          { text: '매우 그렇다', value: 1 },
          { text: '그렇다', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그렇지 않다', value: 4 },
          { text: '전혀 그렇지 않다', value: 5 },
        ],
      },
    ],
    calculateScore: (answers) => {
      const total = answers.reduce((sum, current) => sum + current, 0);
      return Math.round((total / (5 * 5)) * 100);
    },
    getResultMessage: (score) => {
      if (score >= 80) return "매우 건강한 자기이해 수준입니다. 자신에 대한 신뢰가 높고, 감정을 잘 다룹니다.";
      if (score >= 60) return "괜찮은 수준의 자기이해를 갖추고 있습니다. 가끔 자신의 감정이나 욕구를 놓칠 때가 있습니다.";
      if (score >= 40) return "자신을 이해하는 데 약간의 어려움을 겪고 있을 수 있습니다. 스스로를 돌보는 시간을 가져보세요.";
      return "자신에 대한 이해도가 낮아 혼란스러움을 느낄 수 있습니다. 전문가의 도움을 고려해보는 것도 좋습니다.";
    },
  },
  {
    id: 'marriage',
    title: '결혼생활 진단 (30문항)',
    description: '결혼 생활의 만족도와 개선점을 파악합니다.',
    questions: [], // 실제 MarriageDiagnosis.tsx 에서 별도로 관리하므로 빈 배열로 둠
    calculateScore: () => 0, // 사용되지 않음
    getResultMessage: () => '', // 사용되지 않음
  },
  {
    id: 'stress',
    title: '스트레스 자가진단',
    description: '최근 나의 스트레스 수준을 점검해보세요.',
    questions: [
      '최근 일상에서 과도한 긴장이나 압박감을 자주 느낀다.',
      '잠을 자도 피곤이 풀리지 않는다.',
      '작은 일에도 짜증이나 분노가 쉽게 생긴다.',
      '집중력이 떨어지고 실수가 잦다.',
      '두통·소화불량 등 신체 증상이 잦아졌다.',
      '휴식을 취해도 마음이 잘 쉬어지지 않는다.',
    ].map(text => ({
      text,
      options: [
        { text: '매우 그렇다', value: 5 },
        { text: '그렇다', value: 4 },
        { text: '보통이다', value: 3 },
        { text: '그렇지 않다', value: 2 },
        { text: '전혀 그렇지 않다', value: 1 },
      ]
    })),
    calculateScore: (answers) => {
      const total = answers.reduce((sum, current) => sum + current, 0);
      return Math.round((total / (6 * 5)) * 100); // 6 questions
    },
    getResultMessage: (score) => {
      if (score >= 80) return "스트레스 수준이 매우 높습니다. 전문가의 도움이 필요할 수 있습니다.";
      if (score >= 60) return "스트레스가 높은 편입니다. 의식적인 휴식과 스트레스 관리가 필요합니다.";
      if (score >= 40) return "약간의 스트레스가 있습니다. 생활 습관을 점검해보세요.";
      return "스트레스 수준이 건강하게 관리되고 있습니다.";
    },
  },
  {
    id: 'happiness',
    title: '행복감 지수',
    description: '현재 나의 행복감은 어느 정도일까요?',
    questions: [
      '아침에 일어나면 오늘이 기대된다.',
      '내 삶에 의미와 목적을 느낀다.',
      '최근 웃거나 미소 지은 시간이 많다.',
      '감사한 일을 자주 떠올린다.',
      '미래에 대해 희망적으로 생각한다.',
    ].map(text => ({
      text,
      options: [
        { text: '매우 그렇다', value: 5 },
        { text: '그렇다', value: 4 },
        { text: '보통이다', value: 3 },
        { text: '그렇지 않다', value: 2 },
        { text: '전혀 그렇지 않다', value: 1 },
      ]
    })),
    calculateScore: (answers) => {
      const total = answers.reduce((sum, current) => sum + current, 0);
      return Math.round((total / (5 * 5)) * 100); // 5 questions
    },
    getResultMessage: (score) => {
      if (score >= 80) return "매우 높은 행복감을 느끼고 있습니다. 멋진 삶을 살고 계시네요!";
      if (score >= 60) return "일상에서 행복을 잘 느끼고 있는 편입니다.";
      if (score >= 40) return "행복감을 높이기 위한 작은 노력이 필요한 시점입니다.";
      return "삶의 만족도가 낮을 수 있습니다. 자신을 위한 시간을 가져보세요.";
    },
  },
]; 