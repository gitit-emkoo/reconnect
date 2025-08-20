import { DiagnosisTemplate } from './types';

const sex: DiagnosisTemplate = {
  id: 'sex',
  title: '성생활 만족도 진단',
  subtitle: '성적 친밀감과 만족도를 점검하여 부부관계의 건강성을 확인합니다.',
  price: '0',
  questions: [
    { id: 'q1', text: '배우자와의 스킨십이 줄어들면서 정서적으로도 거리가 생긴다고 느낀다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q2', text: '성관계를 피하고 싶다고 생각하는 경우가 많다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q3', text: '성적인 접촉을 시도할 때 부담감이나 불편함을 느낀다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q4', text: '배우자와 애정 표현을 할 때 어색하거나 거리감이 느껴진다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q5', text: '성적인 관계보다 정서적 안정감이나 우정을 더 중요하게 느낀다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q6', text: '배우자와 성에 대해 솔직한 대화를 나눈 적이 거의 없다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q7', text: '배우자와 신체 접촉(손잡기, 포옹, 가벼운 스킨십 등)조차 줄어든 상태다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q8', text: '서로 감정을 나누거나 애정을 표현하는 시간이 부족하다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q9', text: '관계에 대한 불만이나 갈등이 생겨 성적 친밀도에도 영향을 미친다고 느낀다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q10', text: '성적인 관계를 시도해도 배우자가 차갑거나 거부당할 때가 많다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q11', text: '배우자의 신체적 매력에 대한 관심이 예전보다 줄었다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q12', text: '피로, 스트레스, 건강 문제로 인해 성관계를 시도하기 어려운 상태다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q13', text: '최근 성적 욕구가 줄어들거나 사라진 것을 느낀다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q14', text: '성적 만족도가 낮아져서 점점 성관계를 피하는 방향으로 가고 있다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q15', text: '성관계 후에도 만족보다는 허무함이나 부담감을 더 많이 느낀다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q16', text: '배우 일정, 업무·스트레스, 육아 등으로 성관계를 시도할 여유가 부족하다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q17', text: '결혼 초반과 비교했을 때 성관계 빈도가 현저하게 줄어들었다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q18', text: '성관계에 대한 부정적 인상이나 긴장감·설렘을 거의 느끼지 못한다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q19', text: '외부적인 요인(사회, 경제적 문제, 가족 갈등 등)이 성관계 감소에 영향을 주고 있다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
    { id: 'q20', text: '현재 성생활 개선에 대한 필요성을 느끼지만, 방법을 잘 모르겠다.', options: [ { text: '매우 그렇다', value: 5 }, { text: '그렇다', value: 4 }, { text: '보통이다', value: 3 }, { text: '아니다', value: 2 }, { text: '전혀 아니다', value: 1 } ] },
  ],
  calculateScore: (answers: number[]) => answers.reduce((acc, cur) => acc + cur, 0),
  getResultMessage: (score: number) => {
    if (score >= 96) return "섹스리스 심화 단계\n신체적·정서적 단절이 고착화되어 있으며, 서로를 향한 회복 의지조차 희미해진 상태입니다. 섹스리스가 단순한 성적 문제를 넘어, 정서적·신체적인 연결감 상실로 확장되고 있으므로, 이 시점에서는 무작정 '관계를 계속 이어갈 것인지'에 대한 진지한 고민이 필요한 시점이며, 리커넥트의 임상 심리 상담과 관계 중재 과정을 통해 현실적인 방향을 함께 모색해보는 것이 좋습니다. 때로는 '관계를 회복하는 것'만큼이나, '나를 지키는 선택'도 존중받아야 합니다.";
    if (score >= 80) return "섹스리스의 초기 단계\n신체적 접촉은 물론 정서적 대화마저 드물어지고 있는 상태입니다. 서로에 대한 기대가 희미해지고, 감정적으로도 깊은 피로와 거리감이 나타나고 있어요. 이 시점에서는 단순한 노력만으로는 회복이 어려울 수 있으므로, 리커넥트의 전문가 상담을 통해 심리적, 정서적 층위에서 관계를 다시 들여다보는 것이 필요합니다. '무너지는 중'이 아닌, '다시 마주하기' 위한 시도로 이 과정을 설계해보세요.";
    if (score >= 60) return "섹스리스로의 전환 위험이 높은 경계 상태\n감정적 단절과 성적 거리감이 점차 뚜렷해지며, 피로 누적이나 감정 표현 부족이 심화되고 있는 단계입니다. 서로의 감정 흐름을 놓치고 있다면 지금은 적극적인 회복 전략이 필요해요. 리커넥트의 '감정카드'나 '스킨십 챌린지'와 같은 실천 도구를 활용해보시고, 작지만 꾸준한 표현을 통해 관계에 다시 서로 감정에 온기를 불어넣는 시도의 시작이 무엇보다 중요한 시기입니다. '함께 회복하고자 하는 의지'를 확인하는 것이 가장 강력한 회복의 기반이 됩니다.";
    if (score >= 40) return "친밀감 저하에 대한 초기 주의 단계\n애정 표현과 감정 공유가 점차 줄어들고 있으며, 일상 스트레스나 피로가 관계에 영향을 미치고 있는 것으로 보입니다. 이 시점에서는 섹스리스로의 전환을 예방하기 위해 감정의 온도를 다시 점검하고, 짧은 대화, 가벼운 스킨십, 일상 속 애정 표현과 같은 '작은 순간'을 형성해보는 것이 중요합니다. 지금이야말로 관계를 회복적 방향으로 전환할 수 있는 골든타임일 수 있어요. 초기단계에 접어 든다면 회복이 더욱 어렵습니다.";
    if (score >= 20) return "감정적·신체적으로 건강한 친밀감 유지 상태\n현재 관계는 정서적 안정감과 신체적 친밀감이 균형 있게 유지되고 있는 건강한 상태입니다. 애정 표현과 상호 소통이 활발하며, 부부 간 신뢰 기반도 단단하게 유지되고 있어요. 지금의 긍정적인 연결을 유지하기 위해 일상 속 스킨십, 정서적 지지 표현을 꾸준히 실천하시고, 가끔은 특별한 이벤트나 공유 활동을 통해 '감정 온도'를 더욱 따뜻하게 데워보시길 추천드립니다.";
    return "진단 결과가 부족합니다.";
  },
};

export default sex; 