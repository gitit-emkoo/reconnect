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
    questions: [
      // A. 나의 성향 (Q1~Q6)
      '나는 내 감정을 비교적 쉽게 표현하는 편이다.',
      '나는 상대방의 말보다 표정이나 태도에 민감한 편이다.',
      '갈등 상황이 생기면 먼저 대화를 시도하려고 한다.',
      '나는 혼자만의 시간이 꼭 필요한 사람이다.',
      '감정이 상해도 그 자리에서는 표현하지 않는 편이다.',
      '나는 관계 속에서 상대방을 자주 관찰하고 분석한다.',
      // B. 결혼생활에 대한 감정 (Q7~Q12)
      '나는 지금의 결혼생활이 대체로 만족스럽다고 느낀다.',
      '결혼한 이후 나 자신이 감정적으로 더 안정되었다.',
      '나는 결혼 후 외로움을 느끼는 일이 드물다.',
      '요즘 배우자에게 고마운 감정이 자주 든다.',
      '나는 배우자에게 애정을 느끼는 순간이 종종 있다.',
      '나의 결혼생활은 누군가에게 자랑할 수 있을 만큼 괜찮다.',
      // C. 감정 소진 및 불만 영역 (Q13~Q18, 역채점)
      '나는 결혼생활이 때때로 무의미하게 느껴진다.',
      '배우자와 함께 있어도 공허함을 느낀다.',
      '요즘 결혼생활이 점점 버겁다고 느껴진다.',
      '배우자에게 하고 싶은 말이 많지만 꺼내지 못한다.',
      '나는 배우자와 함께 있는 시간보다 혼자 있는 시간이 더 편하다.',
      '때로는 "결혼을 다시 생각해볼 걸"이라는 생각이 든다.',
      // D. 관계 소통과 공감 (Q19~Q24)
      '나는 배우자와 솔직한 감정 대화를 할 수 있다고 믿는다.',
      '우리는 말하지 않아도 서로를 어느 정도 이해한다고 느낀다.',
      '배우자와 사소한 것들을 함께 이야기하는 게 즐겁다.',
      '감정적으로 불안한 날, 배우자가 내 편이 되어준다.',
      '나는 상대의 감정을 자주 먼저 알아차리는 편이다.',
      '우리는 감정 갈등 후 시간이 지나면 자연스럽게 회복된다.',
      // E. 기대치와 관계의 미래 (Q25~Q30)
      '나는 이 결혼생활을 앞으로도 유지하고 싶다.',
      '우리는 앞으로 더 가까워질 수 있다고 생각한다.',
      '결혼생활이 지금보다 나아질 수 있다는 희망이 있다.',
      '나는 배우자와 함께 성장하고 있다고 느낀다.',
      '우리는 앞으로 더 나은 관계를 만들 수 있는 기반이 있다고 본다.',
      "지금은 관계를 다시 돌볼 수 있는 '시기'라고 생각한다."
    ].map(text => ({
      text,
      options: [
        { text: '전혀 그렇지 않다', value: 1 },
        { text: '그렇지 않은 편', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그런 편', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ]
    })),
    calculateScore: (answers) => {
      // 역채점(Q13~Q18, index 12~17)
      const scored = [...answers];
      for (let i = 12; i <= 17; i++) {
        scored[i] = 6 - scored[i];
      }
      const totalScore = scored.reduce((a, b) => a + b, 0);
      // 100점 만점으로 환산
      return Math.round((totalScore / (30 * 5)) * 100);
    },
    getResultMessage: (score) => {
      if (score >= 80) return '지금의 결혼생활에 안정감이 있습니다. 작은 관심만 지속해도 좋아요!';
      if (score >= 60) return '기본적인 애정과 공감은 있지만, 감정 표현과 회복의 노력이 필요해요.';
      if (score >= 40) return '감정 피로가 누적 중입니다. 스스로와 관계를 돌볼 시점이에요.';
      return '마음이 지쳐 있을 가능성이 높습니다. 회복을 위한 외부 자극이 필요해요.';
    },
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