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
    question: '리커넥트 서비스는 어떻게 사용하나요?',
    answer: '리커넥트 서비스는 파트너와 함께 감정 카드를 교환하고, 다양한 미션을 수행하며 관계를 개선해나가는 서비스입니다. 자세한 사용 방법은 앱 내 가이드를 참고해주세요.',
  },
  {
    id: 2,
    question: '파트너 초대는 어떻게 하나요?',
    answer: '마이페이지 또는 홈 화면의 초대 기능을 통해 파트너에게 초대 링크를 보낼 수 있습니다. 파트너가 링크를 통해 가입하면 자동으로 연결됩니다.',
  },
  {
    id: 3,
    question: '감정 카드는 무엇인가요?',
    answer: '감정 카드는 현재 자신의 감정을 표현하고 파트너와 공유할 수 있는 기능입니다. 다양한 감정 상태를 선택하고 간단한 메시지를 추가하여 보낼 수 있습니다.',
  },
  {
    id: 4,
    question: '결제 정보는 어떻게 변경하나요?',
    answer: '현재 리커넥트는 모든 기능을 무료로 제공하고 있으며, 별도의 결제 정보 입력이나 변경이 필요하지 않습니다. 추후 유료 기능이 추가될 경우 별도 안내 드리겠습니다.',
  },
  {
    id: 5,
    question: '계정 탈퇴는 어떻게 하나요?',
    answer: '마이페이지 > 설정 > 회원탈퇴 메뉴를 통해 계정을 탈퇴할 수 있습니다. 탈퇴 시 모든 정보는 복구 불가능하니 신중하게 결정해주세요.',
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