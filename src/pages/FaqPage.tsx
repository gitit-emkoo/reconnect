import React from 'react';
import styled from 'styled-components';
import PageLayout from '../components/Layout/PageLayout';
import FaqItem from '../components/common/FaqItem';

const FaqListContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto; 
`;

const dummyFaqs = [
  {
    id: 1,
    question: '꼭 두 사람이 같이 사용해야 하나요?',
    answer: `아니요. ReConnect는 혼자 시작해도 충분한 변화가 시작됩니다.\n관계 회복은 언제나 한 사람의 인식과 행동 변화에서 출발합니다. ReConnect는 상대방이 함께하지 않아도, 나를 먼저 이해하고 관계를 객관적으로 바라보며 스스로 건강한 결정을 내릴 수 있도록 도와 줍니다.\n하지만 이후에 상대와 함께 사용하는 경우, 양방향 리포트를 통해 더 깊은 서로에 대한 공감과 관계 회복의 기회로 이어질 수 있습니다.`,
  },
  {
    id: 2,
    question: '정말 관계가 개선 될 수 있을까요?',
    answer: `ReConnect는 마법 같은 해결책을 주진 않지만, 후회 없는 노력과 감정적 해방을 도와줍니다.\n관계를 회복할 수 있을지 아무도 장담할 수는 없습니다. 하지만 ReConnect는 다음을 도와줄 수 있습니다:\n- 표현하지 못한 감정을 부드럽게 전달할 수 있고,\n- 매일의 감정을 기록하고 성찰하며\n- 상대와의 거리를 작은 실천으로 좁혀볼 수 있으며 그 과정이 기록으로 남아, 후회 없는 선택의 기반이 됩니다.\n우리는 모두 관계 앞에서 미숙합니다.\nReConnect는 그 미숙함을 이해하고, 함께 걸어가는 앱입니다.`,
  },
  {
    id: 3,
    question: '리커넥트는 어떻게 사용하나요?',
    answer: `ReConnect는 말하기 어려운 감정을 대신 전하고, 관계 회복을 위한 작은 실천을 도와주는 감정 교류 앱입니다.\n간단한 감정 테스트로 시작해, 지금 내 감정 상태와 관계의 온도를 숫자로 확인하고 관리할 수 있어요.\n감정 카드와 감정 다이어리를 통해 평소 표현하지 못했던 마음을 부드럽게 전달할 수 있고,\n부부 챌린지를 통해 함께하는 소소한 실천이 서로를 이해하고 연결하는 큰 변화로 이어질 수 있어요.\n또한 관계 회복의 여정에서 도움이 필요하다면 심리상담가, 법률가 등 분야별 전문가와의 연결도 지원합니다.`,
  },
  {
    id: 4,
    question: '감정 일기는 무엇인가요?',
    answer: `1분 감정 일기는 '나를 이해하는 연습'입니다.\n매일 단 한 줄, 내 감정을 적는 것만으로도 감정의 흐름, 관계의 변화, 마음의 징후를 발견할 수 있어요.\n"오늘 왜 유독 예민했을까?"\n"언제부턴가 말이 줄었지...?"\n우리는 늘 감정 속에 살지만, 그 감정을 이해하려는 시간은 거의 없죠.\nReConnect의 감정 일기는 1분이면 충분한 감정 기록입니다.\n정리되지 않은 마음을 천천히 마주할 수 있게 돕는 습관\n감정을 말로 꺼내기 전, 나와 먼저 대화하는 시작점이 되어줍니다.`,
  },
  {
    id: 5,
    question: '감정 카드는 무엇인가요?',
    answer: `화를 내고 싶지 않아 말하지 않았던 감정들이 쌓여 거리가 멀어지기도 합니다.\n감정 카드는 말 대신, 감정을 조심스럽게 건네는 도구입니다.\n직접 말하지 않아도, 카드 하나로 나의 감정을 전할 수 있습니다.\n그 감정은 텍스트가 아니라, 마음의 온도로 전해집니다.\n말 대신 전하는 '서운함', '고마움', '미안함' 같은 감정\n카톡이나 전화처럼 설명하거나 설득하지 않아도 되는 방식\n시간이 지나도 감정의 기록을 조용히 남겨주는 정서적 흔적\nReConnect는 감정을 강요하지 않습니다.\n대신, 말하지 못한 마음을 놓치지 않도록 기록합니다.\n그게 리커넥트가 감정카드를 만든 이유입니다.`,
  },
];

const FaqPage: React.FC = () => {
  return (
    <PageLayout title="자주하는 질문" showBackButton={true}>
      <FaqListContainer>
        {dummyFaqs.map(faq => (
          <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
        ))}
      </FaqListContainer>
    </PageLayout>
  );
};

export default FaqPage; 