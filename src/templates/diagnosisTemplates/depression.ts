import { DiagnosisTemplate } from './types';

const depression: DiagnosisTemplate = {
  id: 'depression',
  title: '우울증 진단',
  subtitle: '정서적 안정감, 무기력, 자살 사고 등 다양한 우울 증상을 점검합니다.',
  price: '이벤트 무료오픈',
  questions: [
    { id: 'q1', text: '하루 대부분의 시간 동안 기분이 가라앉거나 슬프다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q2', text: '예전에는 즐겁던 활동에 흥미나 즐거움을 느끼지 못한다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q3', text: '피로감이나 에너지가 부족하다고 느낀다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q4', text: '잠이 잘 오지 않거나 너무 많이 잔다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q5', text: '식욕이 감소하거나 과식하게 된다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q6', text: '체중이 특별한 이유 없이 변한다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q7', text: '자신이 무가치하다고 느낀다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q8', text: '반복적으로 자신을 비난하거나 죄책감을 느낀다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q9', text: '집중력이 떨어져 책이나 TV에 몰입하기 어렵다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q10', text: '결정을 내리는 것이 어렵게 느껴진다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q11', text: '말이나 행동이 느려졌다는 느낌이 든다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q12', text: '반대로 안절부절 못하거나 과도하게 움직인다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q13', text: '미래에 대한 희망이 없다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q14', text: '죽음에 대해 자주 생각하거나 자살 충동이 든다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q15', text: '아침에 일어나는 것이 매우 힘들다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q16', text: '일상적인 일조차 버겁게 느껴진다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q17', text: '사람들과의 관계를 힘들고 어렵게 느낀다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q18', text: '외로움이나 고립감을 자주 느낀다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q19', text: '사소한 일에도 쉽게 눈물이 난다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q20', text: '감정이 무뎌지거나 점이 된다고 느낀다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q21', text: '감정이 둔해지고 아무것도 느껴지지 않는다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q22', text: '과거의 실수나 후회가 자꾸 떠오른다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q23', text: '성욕이 줄었거나 사라졌다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q24', text: '신체 통증(두통, 복통 등)이 있지만 의학적 원인을 찾기 어렵다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q25', text: '자신이 실패자라는 생각이 자주 든다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q26', text: '작은 실수에도 불안이 과도하게 민감해진다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q27', text: '전에 없던 걱정이 많아진 느낌이 든다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q28', text: '전에 없던 갈라졌다는 느낌이 든다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q29', text: '아무것도 하지 않아도 지치고 무기력하다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q30', text: '아무것도 실수나 후회가 자꾸 떠오른다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
  ],
  calculateScore: (answers: number[]) => answers.reduce((acc, cur) => acc + cur, 0),
  getResultMessage: (score: number) => {
    if (score >= 136) return `위기 상태\n자살 사고 또는 자해 충동이 매우 높을 수 있음\n즉시 정신과 전문의 또는 자살 예방핫라인(☎ 1393) 연락해야 합니다. 특히 혼자 두지 말고, 정신건강의학과를 통한 진단 및 필요한 약물 치료가 동반된다면 회복할 수 있습니다. 지금이 기회입니다.`;
    if (score >= 121) return `심각한 우울 상태\n현재의 정서 상태는 심각한 우울 상태로 평가됩니다. 이 단계에서는 응급 수준의 정신건강 개입이 필요할 수 있으며, 의학적 평가를 바탕으로 일차 치료 또는 집중적인 심리치료를 적극적으로 고려하여야 합니다. 또한, 혼자 감당하지 말고 반드시 가족이나 가까운 지인 등과 협력이 반드시 필요한 시점입니다.`;
    if (score >= 106) return `중증 우울증 가능성\n지속적인 무기력, 자책, 수면 장애, 극단적인 생각 등으로 인해 정서적 위기 상태에 가까운 단계로 판단됩니다. 이러한 변화는 혼자 감당하기 어렵기 때문에 즉각적인 정신건강의학과 상담을 통해 정서 상태를 점검하고, 필요 시 약물치료와 인지행동치료를 병행하는 것이 회복에 큰 도움이 될 수 있습니다. 또한, 위급한 감정이 반복되거나 자해에 대한 충동이 있다면, 정신건강상담전화(☎ 1577-0199)와 같은 공적 위기 개입 자원을 반드시 활용해 주세요.`;
    if (score >= 91) return `중등도 우울증 가능성\n일상에서의 집중력이나 에너지가 눈에 띄게 떨어져 있으며, 자존감 역시 함께 저하되고 있는 신호가 나타나고 있습니다. 이러한 변화는 단순한 일시적 기분 저하를 넘어, 일상 기능과 심리적 안정성에 영향을 미칠 수 있는 단계이기 때문에 세심한 주의가 필요합니다. 지금은 전문 심리상담을 통해 정서적 상태를 점검하고, 필요한 활동을 가볍게 재개해보는 것도 내 유지하는 것이 심리적 안전망 형성에 큰 도움이 됩니다.`;
    if (score >= 76) return `경도 우울증 의심\n의욕 저하, 집중력 감소, 감정 기복이 두드러지게 나타나고 있는 상태입니다. 이러한 변화는 단순한 피로를 넘어, 정서적 조짐이나 심리적 불균형의 신호일 수 있으므로 이 시점에서는 감정 상태를 주의 깊게 점검하고 회복 방향을 설정하는 것이 중요합니다. 자기 인식 훈련과 더불어, 과거에 즐거움을 줬던 취미 활동을 가볍게 재개해보는 것도 정서적 활력을 회복하는 데 큰 도움이 됩니다.`;
    if (score >= 61) return `주의 요망 단계\n기분 저하가 자주 느껴지고, 일상 기능에도 영향을 줄 수 있는 상태입니다. 이 시점에서는 스스로의 정서 상태를 세심하게 들여다보는 것이 중요합니다. 감정 일기 기능을 활용해 자신의 감정 흐름을 정리해보시고, 생활 리듬이 무너져 보인다면 수면·식사·운동 루틴을 점검해보는 것도 좋은 시작이 될 수 있습니다. 업무나 일상 속 스트레스를 완화할 수 있도록 '회복 루틴 추천' 콘텐츠도 함께 활용해보세요.`;
    if (score >= 46) return `경미한 우울감\n가벼운 무기력감이나 피로감이 느껴질 수 있는 시기입니다. 아직 심각한 정서적 불균형은 아니지만, 스트레스가 축적되기 전 미리 관리하는 것이 매우 중요합니다. 지금은 나에게 영향을 주는 스트레스 요인을 점검하고, 산책이나 명상처럼 무리가 가지 않는 활동을 통해 긴장을 완화하는 시간이 필요합니다. 또한 신뢰할 수 있는 사람과 감정을 나누는 것만으로도 정서적 안정감을 크게 회복할 수 있습니다.`;
    if (score >= 30) return `정서적 안정 상태\n기분이 전반적으로 안정적이며, 우울감이나 무기력감이 거의 느껴지지 않는 건강한 정서 상태입니다. 현재의 생활 습관과 감정 조절 방식이 잘 작동하고 있는 것으로 보이며, 이러한 균형을 꾸준히 유지하는 것이 매우 중요합니다. 앞으로도 지금처럼 규칙적인 수면과 운동 습관을 유지하고, 감정 일기나 자기 돌봄 루틴을 통해 나의 마음을 정기적으로 점검해보시길 권장드립니다.`;
    return '진단 결과가 부족합니다.';
  },
};

export default depression; 