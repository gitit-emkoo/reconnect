export interface DiagnosisQuestion {
  id: string;
  text: string;
  options?: { text: string; value: number }[];
  scores?: { yes: number; no: number; neutral: number };
}

export interface DiagnosisTemplate {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  questions: DiagnosisQuestion[];
  calculateScore: (answers: number[]) => number;
  getResultMessage?: (score: number) => string;
}

export const DIAGNOSIS_TEMPLATES: DiagnosisTemplate[] = [
  {
    id: 'marriage',
    title: '결혼생활 만족도 진단',
    subtitle: '부부 관계 전반의 정서적 안정감, 만족도, 상호 신뢰의 수준을 점검하여 건강한 결혼생활의 기반을 확인합니다.',
    price: '무료(이벤트)',
    questions: [
      {
        id: 'q1',
        text: '나는 내 감정을 비교적 쉽게 표현하는 편이다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q2',
        text: '나는 상대방의 말보다 표정이나 태도에 민감한 편이다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q3',
        text: '갈등 상황이 생기면 먼저 대화를 시도하려고 한다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q4',
        text: '나는 혼자만의 시간이 꼭 필요한 사람이다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q5',
        text: '감정이 상해도 그 자리에서는 표현하지 않는 편이다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q6',
        text: '나는 관계 속에서 상대방을 자주 관찰하고 분석한다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q7',
        text: '나는 지금의 결혼생활이 대체로 만족스럽다고 느낀다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q8',
        text: '결혼한 이후 나 자신이 감정적으로 더 안정되었다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q9',
        text: '나는 결혼 후 외로움을 느끼는 일이 드물다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q10',
        text: '요즘 배우자에게 고마운 감정이 자주 든다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q11',
        text: '나는 배우자에게 애정을 느끼는 순간이 종종 있다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q12',
        text: '나의 결혼생활은 누군가에게 자랑할 수 있을 만큼 괜찮다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q13',
        text: '나는 결혼생활이 때때로 무의미하게 느껴진다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q14',
        text: '배우자와 함께 있어도 공허함을 느낀다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q15',
        text: '요즘 결혼생활이 점점 버겁다고 느껴진다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q16',
        text: '배우자에게 하고 싶은 말이 많지만 꺼내지 못한다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q17',
        text: '나는 배우자와 함께 있는 시간보다 혼자 있는 시간이 더 편하다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q18',
        text: '때로는 "결혼을 다시 생각해볼 걸"이라는 생각이 든다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q19',
        text: '나는 배우자와 솔직한 감정 대화를 할 수 있다고 믿는다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q20',
        text: '우리는 말하지 않아도 서로를 어느 정도 이해한다고 느낀다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q21',
        text: '배우자와 사소한 것들을 함께 이야기하는 게 즐겁다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q22',
        text: '감정적으로 불안한 날, 배우자가 내 편이 되어준다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q23',
        text: '나는 상대의 감정을 자주 먼저 알아차리는 편이다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q24',
        text: '우리는 감정 갈등 후 시간이 지나면 자연스럽게 회복된다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q25',
        text: '나는 이 결혼생활을 앞으로도 유지하고 싶다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q26',
        text: '우리는 앞으로 더 가까워질 수 있다고 생각한다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q27',
        text: '결혼생활이 지금보다 나아질 수 있다는 희망이 있다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q28',
        text: '나는 배우자와 함께 성장하고 있다고 느낀다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q29',
        text: '우리는 앞으로 더 나은 관계를 만들 수 있는 기반이 있다고 본다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
      {
        id: 'q30',
        text: '지금은 관계를 다시 돌볼 수 있는 "시기"라고 생각한다.',
        options: [
          { text: '전혀 그렇지 않다', value: 1 },
          { text: '그렇지 않은 편', value: 2 },
          { text: '보통이다', value: 3 },
          { text: '그런 편', value: 4 },
          { text: '매우 그렇다', value: 5 },
        ],
      },
    ],
    calculateScore: answers => {
      // 역채점(Q13~Q18, index 12~17)
      const scored = [...answers];
      for (let i = 12; i <= 17; i++) {
        scored[i] = 6 - scored[i];
      }
      const totalScore = scored.reduce((a, b) => a + b, 0);
      // 100점 만점으로 환산
      return Math.round((totalScore / (30 * 5)) * 100);
    },
    getResultMessage: score => {
      if (score >= 80) return '지금의 결혼생활에 안정감이 있습니다. 작은 관심만 지속해도 좋아요!';
      if (score >= 60) return '기본적인 애정과 공감은 있지만, 감정 표현과 회복의 노력이 필요해요.';
      if (score >= 40) return '감정 피로가 누적 중입니다. 스스로와 관계를 돌볼 시점이에요.';
      return '마음이 지쳐 있을 가능성이 높습니다. 회복을 위한 외부 자극이 필요해요.';
    },
  },
  {
    id: 'sex_life',
    title: '성 생활 위기 신호 진단',
    subtitle: '성생활의 단절은 부부 관계에서 침묵 속에 쌓이는 갈등입니다. 이 테스트는 만족도뿐 아니라 감정적 외로움, 욕구 불균형, 표현의 어려움 등을 다각적으로 점검하여 숨겨진 위기 징후를 드러냅니다.',
    price: '50,000',
    questions: [
      {
        id: 'q1',
        text: '배우자와의 현재 성생활에 만족하시나요?',
        scores: { yes: 5, no: 1, neutral: 3 },
      },
      {
        id: 'q2',
        text: '성적인 욕구나 판타지에 대해 배우자와 솔직하게 대화하기 어렵다고 느낍니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q3',
        text: '성관계 횟수나 방식에 대한 불만이 관계 전반에 영향을 미치고 있습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q4',
        text: '성관계 후, 신체적 만족감과 별개로 정서적 허무함을 느낄 때가 있습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q5',
        text: '배우자가 성관계를 회피하거나 의무적으로 응하는 것처럼 느껴진 적이 있습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
    ],
    calculateScore: (answers: number[]) => {
      const totalScore = answers.reduce((a, b) => a + b, 0);
      return Math.round(((totalScore - 5) / (25 - 5)) * 100);
    },
    getResultMessage: score => {
      if (score >= 80) return '배우자와의 성적 소통이 매우 건강하며, 서로에 대한 깊은 신뢰와 만족감을 느끼고 있습니다.';
      if (score >= 60) return '대체로 만족스러운 성생활을 하고 있지만, 가끔 표현하지 못하는 아쉬움이 있을 수 있습니다. 작은 변화를 시도해보세요.';
      if (score >= 40) return '성생활에 대한 불만이나 오해가 조금씩 쌓이고 있을 수 있습니다. 솔직한 대화가 필요한 시점입니다.';
      if (score >= 20) return '정서적, 신체적 거리감이 느껴질 수 있습니다. 관계의 위기 신호일 수 있으니 주의 깊게 살펴보세요.';
      return '성생활이 관계의 큰 스트레스 요인이 되고 있을 가능성이 높습니다. 전문가의 도움이 필요할 수 있습니다.';
    },
  },
  {
    id: 'stress',
    title: '스트레스 반응 및 조절 진단',
    subtitle: '일상 속 스트레스 지각과 반응 방식, 대처 능력을 점검하여 정서적 회복력과 관계 유지력을 함께 진단합니다.',
    price: '50,000',
    questions: [
      {
        id: 'q1',
        text: '최근 사소한 일에도 쉽게 짜증이 나거나 감정적으로 변한다고 느낍니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q2',
        text: '스트레스를 받을 때, 배우자에게 의지하기보다 혼자 해결하려는 경향이 있습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q3',
        text: '업무나 개인적인 스트레스가 부부 관계에 부정적인 영향을 미치고 있다고 생각하십니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q4',
        text: '스트레스 해소를 위해 음주, 쇼핑 등 충동적인 행동에 의존할 때가 있습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q5',
        text: '스트레스 상황에서 배우자와의 대화가 문제 해결에 도움이 되기보다 또 다른 스트레스가 된 적이 있습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
    ],
    calculateScore: (answers: number[]) => {
      const totalScore = answers.reduce((a, b) => a + b, 0);
      return Math.round(((totalScore - 5) / (25 - 5)) * 100);
    },
    getResultMessage: score => {
      if (score >= 80) return '스트레스 관리 능력이 뛰어나며, 어려운 상황에서도 정서적 안정감을 잘 유지하고 있습니다.';
      if (score >= 60) return '일상적인 스트레스는 잘 대처하고 있지만, 큰 스트레스 상황에서는 다소 어려움을 겪을 수 있습니다.';
      if (score >= 40) return '스트레스가 조금씩 누적되어 피로감을 느끼고 있을 수 있습니다. 의식적인 휴식과 재충전이 필요합니다.';
      if (score >= 20) return '만성적인 스트레스로 인해 감정 조절에 어려움을 겪고 있을 수 있습니다. 관계에도 부정적인 영향이 있을 수 있습니다.';
      return '스트레스가 심각한 수준으로, 번아웃이 우려됩니다. 적극적인 대처와 도움이 시급합니다.';
    },
  },
  {
    id: 'depression',
    title: '우울감 및 정서 안정 진단',
    subtitle: '기분 저하, 무기력, 자기비하 등의 정서 상태를 점검하여 우울 증상의 유무와 심리적 위험도를 조기에 확인합니다.',
    price: '50,000',
    questions: [
      {
        id: 'q1',
        text: '최근 몇 주간, 대부분의 활동에서 흥미나 즐거움을 느끼기 어려웠습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q2',
        text: '이유 없이 슬프거나 공허한 기분이 들고, 때로는 눈물이 날 것 같습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q3',
        text: '미래에 대해 희망이 없거나 비관적으로 느껴질 때가 자주 있습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q4',
        text: '스스로를 실패자라고 느끼거나 가족을 실망시켰다는 죄책감에 시달립니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q5',
        text: '자신의 감정 상태를 배우자나 주변 사람들에게 솔직하게 털어놓기 어렵습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
    ],
    calculateScore: (answers: number[]) => {
      const totalScore = answers.reduce((a, b) => a + b, 0);
      return Math.round(((totalScore - 5) / (25 - 5)) * 100);
    },
    getResultMessage: score => {
      if (score >= 80) return '정서적으로 매우 안정되어 있으며, 일상에서 활력과 즐거움을 느끼고 있습니다.';
      if (score >= 60) return '대체로 긍정적인 감정 상태를 유지하지만, 가끔 기분 저하를 경험할 수 있습니다.';
      if (score >= 40) return '우울감이 지속되어 일상생활에 조금씩 영향을 미치고 있을 수 있습니다. 기분 전환을 위한 노력이 필요합니다.';
      if (score >= 20) return '우울 증상이 의심되는 수준입니다. 자신의 감정을 잘 살피고 주변에 도움을 요청하는 것이 좋습니다.';
      return '심리적으로 많이 지쳐있을 가능성이 높습니다. 전문가와의 상담을 통해 상태를 점검해보는 것이 매우 중요합니다.';
    },
  },
  {
    id: 'affection_deficiency',
    title: '정서적 애정결핍 성향 진단',
    subtitle: '타인에 대한 애정 의존, 감정 과민성, 공허감 등의 성향을 진단하여 관계에서의 불안정 요인을 파악합니다.',
    price: '50,000',
    questions: [
      {
        id: 'q1',
        text: '배우자의 관심이나 애정이 조금이라도 줄어들면 불안하고 버림받을 것 같은 두려움을 느낍니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q2',
        text: '상대방의 사소한 말이나 행동에도 큰 의미를 부여하고 쉽게 상처받는 편입니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q3',
        text: '혼자 있는 시간을 견디기 힘들고, 늘 누군가와 연결되어 있어야 안심이 됩니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q4',
        text: '배우자에게 사랑을 확인받기 위해 끊임없이 노력하거나, 반대로 상대를 시험하는 행동을 한 적이 있습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q5',
        text: '관계가 끝나면 내 삶이 무너질 것 같다는 극심한 공포를 느낍니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
    ],
    calculateScore: (answers: number[]) => {
      const totalScore = answers.reduce((a, b) => a + b, 0);
      return Math.round(((totalScore - 5) / (25 - 5)) * 100);
    },
    getResultMessage: score => {
      if (score >= 80) return '안정적인 애착 관계를 형성하고 있으며, 관계에서 편안함과 신뢰를 느끼고 있습니다.';
      if (score >= 60) return '대체로 안정적인 관계를 유지하지만, 가끔 상대의 애정을 확인하고 싶을 때가 있습니다.';
      if (score >= 40) return '관계에서 불안감을 느끼거나 애정결핍을 경험할 때가 있습니다. 자신의 감정적 욕구를 돌아볼 필요가 있습니다.';
      if (score >= 20) return '버림받을 것에 대한 두려움이나 과도한 애정 갈구가 관계를 힘들게 할 수 있습니다.';
      return '애정결핍으로 인한 불안정성이 관계에 심각한 영향을 미치고 있을 수 있습니다. 근본적인 원인을 탐색하는 것이 중요합니다.';
    },
  },
  {
    id: 'communication',
    title: '의사소통 패턴 진단',
    subtitle: '감정 표현, 경청 태도, 공감 능력 등의 커뮤니케이션 습관을 점검하여 건강한 대화 방식의 강점과 약점을 확인합니다.',
    price: '50,000',
    questions: [
      {
        id: 'q1',
        text: '자신의 감정(기쁨, 슬픔, 분노 등)을 배우자에게 솔직하게 표현하는 것이 어렵습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q2',
        text: '배우자가 이야기할 때, 중간에 말을 끊거나 반박하고 싶은 충동을 자주 느낍니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q3',
        text: '대화 도중 갈등이 생길 것 같으면, 아예 입을 닫거나 자리를 피하는 편입니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q4',
        text: '배우자의 말을 듣고 "당신이 무슨 말을 하는지는 알겠지만, 내 생각은 달라" 와 같은 방식으로 자주 응답합니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q5',
        text: '과거의 잘못을 현재의 논쟁에 끌어들이는 경향이 있습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
    ],
    calculateScore: (answers: number[]) => {
      const totalScore = answers.reduce((a, b) => a + b, 0);
      return Math.round(((totalScore - 5) / (25 - 5)) * 100);
    },
    getResultMessage: score => {
      if (score >= 80) return '배우자와 매우 개방적이고 건강한 방식으로 소통하고 있습니다. 갈등 해결 능력도 뛰어납니다.';
      if (score >= 60) return '대부분의 상황에서 원활하게 소통하지만, 민감한 주제에 대해서는 대화를 피하는 경향이 있을 수 있습니다.';
      if (score >= 40) return '오해나 불만이 쌓일 수 있는 소통 패턴을 가지고 있습니다. 적극적인 경청과 표현 연습이 필요합니다.';
      if (score >= 20) return '소통의 부재가 관계의 단절로 이어지고 있을 수 있습니다. 비난, 방어적인 태도를 점검해보세요.';
      return '심각한 소통 단절 상태일 가능성이 높습니다. 대화 자체가 갈등의 원인이 될 수 있어 전문가의 개입이 필요할 수 있습니다.';
    },
  },
  {
    id: 'conflict_resolution',
    title: '갈등 회피 및 해결 스타일 진단',
    subtitle: '갈등 상황에서의 반응 유형, 대처 습관, 회복력 등을 분석해 관계 유지 및 회복을 위한 전략적 통찰을 제공합니다.',
    price: '50,000',
    questions: [
      {
        id: 'q1',
        text: '갈등이 생겼을 때, 문제의 핵심을 다루기보다 상대방을 비난하거나 인신공격할 때가 있습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q2',
        text: '한번 다투고 나면, 며칠 동안 냉전 상태를 유지하며 먼저 화해하지 않으려는 경향이 있습니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q3',
        text: '갈등 상황에서 자신의 의견을 관철시키기 위해 목소리를 높이거나 과격한 언어를 사용합니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q4',
        text: '문제 해결을 위해 노력하기보다, "원래 그런 사람이다"라며 포기하고 체념하는 편입니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
      {
        id: 'q5',
        text: '갈등 후, 배우자와의 관계가 완전히 회복되었다고 느끼기까지 오랜 시간이 걸립니까?',
        scores: { yes: 1, no: 5, neutral: 3 },
      },
    ],
    calculateScore: (answers: number[]) => {
      const totalScore = answers.reduce((a, b) => a + b, 0);
      return Math.round(((totalScore - 5) / (25 - 5)) * 100);
    },
    getResultMessage: score => {
      if (score >= 80) return '갈등을 성장의 기회로 삼으며, 매우 건설적인 방식으로 문제를 해결해나갑니다.';
      if (score >= 60) return '갈등을 해결하려는 의지는 있으나, 때로는 감정적인 대응으로 인해 어려움을 겪을 수 있습니다.';
      if (score >= 40) return '갈등 상황을 회피하거나, 같은 문제가 반복적으로 발생할 가능성이 있습니다.';
      if (score >= 20) return '파괴적인 갈등 패턴(비난, 경멸, 방어, 담쌓기)이 나타날 수 있습니다. 관계에 심각한 손상을 줄 수 있습니다.';
      return '갈등이 관계를 회복 불가능한 수준으로 악화시킬 수 있습니다. 관계 개선을 위한 적극적인 노력이 시급합니다.';
    },
  },
]; 