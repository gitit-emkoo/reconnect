import { DiagnosisTemplate } from './types';

const marriage: DiagnosisTemplate = {
  id: 'marriage',
  title: '결혼생활 만족도 진단',
  subtitle: '부부 관계 전반의 정서적 안정감, 만족도, 상호 신뢰의 수준을 점검하여 건강한 결혼생활의 기반을 확인합니다.',
  price: '무료(이벤트)',
  questions: [
    {
      id: 'q1',
      text: '나는 내 감정을 비교적 쉽게 표현하는 편이다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q2',
      text: '나는 상대방의 말보다 표정이나 태도에 민감한 편이다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q3',
      text: '갈등 상황이 생기면 먼저 대화를 시도하려고 한다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q4',
      text: '나는 혼자만의 시간이 꼭 필요한 사람이다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q5',
      text: '감정이 상해도 그 자리에서는 표현하지 않는 편이다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q6',
      text: '나는 관계 속에서 상대방을 자주 관찰하고 분석한다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q7',
      text: '나는 지금의 결혼생활이 대체로 만족스럽다고 느낀다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q8',
      text: '결혼한 이후 나 자신이 감정적으로 더 안정되었다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q9',
      text: '나는 결혼 후 외로움을 느끼는 일이 드물다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q10',
      text: '요즘 배우자에게 고마운 감정이 자주 든다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q11',
      text: '나는 배우자에게 애정을 느끼는 순간이 종종 있다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q12',
      text: '나의 결혼생활은 누군가에게 자랑할 수 있을 만큼 괜찮다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q13',
      text: '나는 결혼생활이 때때로 무의미하게 느껴진다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q14',
      text: '배우자와 함께 있어도 공허함을 느낀다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q15',
      text: '요즘 결혼생활이 점점 버겁다고 느껴진다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q16',
      text: '배우자에게 하고 싶은 말이 많지만 꺼내지 못한다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q17',
      text: '나는 배우자와 함께 있는 시간보다 혼자 있는 시간이 더 편하다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q18',
      text: '때로는 "결혼을 다시 생각해볼 걸"이라는 생각이 든다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q19',
      text: '나는 배우자와 솔직한 감정 대화를 할 수 있다고 믿는다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q20',
      text: '우리는 말하지 않아도 서로를 어느 정도 이해한다고 느낀다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q21',
      text: '배우자와 사소한 것들을 함께 이야기하는 게 즐겁다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q22',
      text: '감정적으로 불안한 날, 배우자가 내 편이 되어준다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q23',
      text: '나는 상대의 감정을 자주 먼저 알아차리는 편이다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q24',
      text: '우리는 감정 갈등 후 시간이 지나면 자연스럽게 회복된다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q25',
      text: '나는 이 결혼생활을 앞으로도 유지하고 싶다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q26',
      text: '우리는 앞으로 더 가까워질 수 있다고 생각한다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q27',
      text: '결혼생활이 지금보다 나아질 수 있다는 희망이 있다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q28',
      text: '나는 배우자와 함께 성장하고 있다고 느낀다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },    
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q29',
      text: '우리는 앞으로 더 나은 관계를 만들 수 있는 기반이 있다고 본다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
    {
      id: 'q30',
      text: '지금은 관계를 다시 돌볼 수 있는 "시기"라고 생각한다.',
      options: [
        { text: '전혀 아니다', value: 1 },
        { text: '아니다', value: 2 },
        { text: '보통이다', value: 3 },
        { text: '그렇다', value: 4 },
        { text: '매우 그렇다', value: 5 },
      ],
    },
  ],
    
  calculateScore: (answers: number[]) => {
    const rawScore = answers.reduce((acc, cur) => acc + cur, 0);
    // 150점 만점을 100점 만점으로 변환
    return Math.round((rawScore / 150) * 100);
  },
  getResultMessage: (score: number) => {
    if (score >= 97) return '완벽한 결혼 생활과 강한 유대감\n배우자와 깊은 관계를 유지하며 결혼생활에서 최고의 안정과 행복을 경험하는 단계입니다. 장기적으로도 긍정적인 전망을 기대할 수 있습니다. 완벽한 배우자에게 작은 선물을 해보시는 건 어때요?';
    if (score >= 94) return '매우 높은 만족과 깊은 유대\n결혼생활에서 강한 신뢰와 애정을 느끼며, 배우자와의 관계가 성장하고 있습니다. 지금 이 관계를 유지하기 위해 일상 속에서 작은 노력만 한다면 행복한 결혼생활을 이어 나갈 수 있습니다.';
    if (score >= 87) return '높은 만족과 긍정적인 미래 전망\n결혼생활에서 높은 만족감을 경험하고 있는 상태입니다, 배우자와의 관계가 안정적이고 긍정적인 방향으로 나아가는 상태입니다. 따뜻한 관계에서 뜨거운관계로 발전하기에 가장 적합한 상황이라고 볼 수 있습니다.';
    if (score >= 81) return '안정적인 관계와 원활한 소통\n배우자와 긍정적인 관계를 형성하며, 갈등이 발생해도 어렵지 않게 해결 능력이 높은 상태입니다. 관계를 유지하려는 노력보다 지속적인 관계 발전을 위한 노력에 포커스를 맞추는 것이 좋습니다.';
    if (score >= 71) return '비교적 안정된 결혼 생활\n배우자와의 관계에서 감정적으로 적당한 만족을 느끼며, 갈등이 생기면 해결될 가능성이 높긴 하지만 더 깊은 소통과 내적 친밀감이 더해지면 더욱더행복한 결혼 생활이 기대되는 상태입니다. 일상 속에서 서로 조금 더 관심과 감정 교류의 노력이 필요합니다.';
    if (score >= 61) return '중립적 감정 상태\n결혼생활에서 균형을 이루고 있지만, 감정적 친밀감은 다소 부족한 상태입니다. 행복한 결혼 생활을 위해서는 감정나눔이 어느때보다 필요합니다. 전문가의 도움 없이도 리커넥트등 감정교류를 도와주는 프로그램과 포함한 일상적인 노력으로 충분히 개선이 가능합니다.';
    if (score >= 51) return '부분적 불만족과 갈등 해결 필요\n평균보다 다소 낮은 상태로 관계가 유지되지만 감정적 만족도가 낮아 변화가 절실하게 필요한 상태입니다. 방치하면 상황이 악화되고 관심을 갖고 해결 하고자 한다면 충분히 긍정적인 변화가 예상됩니다. 관계 개선을 위한 작은 변화를 시작해 보세요';
    if (score >= 41) return '관계 단절 가능성 및 갈등\n배우자와의 감정적 거리감이 크며, 결혼생활 유지에 대한 고민이 많은 상태입니다. 후회 없는 선택을 위해 필히 관계 개선을 위한 노력을 선행해야 하는상황입니다. 늦어지면 감정적 상처와 현실적 어려움이 가중될 수 있기 때문에 시기를 놓치지 않는 노력이 꼭 필요합니다.';
    if (score >= 31) return '높은 불만족과 감정 소진\n배우자와의 관계에서 피로감과 소통 부족을 자주 경험하며, 마음이 많이 지쳐있는 상태로 감정회복을 위한 노력과 관계 개선을 위한 노력이 동반되어야 하는상황 입니다. 적극적인 관계개선 활동과 적절한 전문가의 도움으로 극복할수 있습니다.';
    if (score >= 20) return '심각한 불만족과 관계 위기\n결혼생활에서 지속적인 갈등과 스트레스를 경험하며, 관계 유지가 매우 어려운 상태입니다. 전문가의 도움없이 해결하기는 현실적으로 어려운 상황입니다.';
    return '진단 결과가 부족합니다.';
  },
};

export default marriage; 