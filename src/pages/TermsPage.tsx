import React from 'react';
// import { useNavigate } from 'react-router-dom'; // PageLayout에서 처리
import styled from 'styled-components';
import PageLayout from '../components/Layout/PageLayout'; // PageLayout 임포트

// Container, BackButton, Title 스타일 컴포넌트는 PageLayout으로 대체되므로 제거
/*
const Container = styled.div` ... `;
const BackButton = styled.button` ... `;
const Title = styled.h1` ... `;
*/

const Content = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 1rem; /* PageLayout 내부 ContentArea의 패딩과 중복될 수 있으므로 조정 */
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto; /* 중앙 정렬을 위해 추가 */
`;

const Section = styled.section`
  margin-bottom: 2rem;

  h2 {
    font-size: 0.8rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    font-size: 0.7rem;
    color: #666;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: disc;
    margin-left: 1.5rem;
    margin-bottom: 1rem;

    li {
    font-size: 0.7rem;
      color: #666;
      margin-bottom: 0.5rem;
    }
  }
`;

const TermsPage: React.FC = () => {
  // const navigate = useNavigate(); // PageLayout에서 처리

  return (
    <PageLayout title="이용약관" showBackButton={true}>
      <Content>
        <Section>
          <h2>1. 약관의 목적</h2>
          <p>
            본 약관은 리커넥트(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 
            이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </Section>

        <Section>
          <h2>2. 개인정보 수집 및 이용</h2>
          <p>회사는 다음과 같은 개인정보를 수집하고 이용합니다:</p>
          <ul>
            <li>이메일 주소: 서비스 이용 및 고지사항 전달</li>
            <li>닉네임: 서비스 내 이용자 식별</li>
            <li>비밀번호: 계정 보안</li>
          </ul>
        </Section>

        <Section>
          <h2>3. 이용자의 의무</h2>
          <p>이용자는 다음 사항을 준수해야 합니다:</p>
          <ul>
            <li>타인의 정보 도용 금지</li>
            <li>회사의 서비스를 이용하여 법령과 본 약관이 금지하는 행위를 하지 않을 것</li>
            <li>회사의 서비스를 이용하여 타인에게 피해를 주지 않을 것</li>
          </ul>
        </Section>

        <Section>
          <h2>4. 서비스 제공 및 변경</h2>
          <p>
            회사는 서비스를 365일, 24시간 제공하기 위해 노력합니다. 다만, 시스템 점검, 
            서비스 개선, 천재지변 등의 불가피한 사유로 서비스 제공이 일시 중단될 수 있습니다.
          </p>
        </Section>

        <Section>
          <h2>5. 약관의 변경</h2>
          <p>
            회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 
            통해 공지합니다. 변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단할 수 있습니다.
          </p>
        </Section>
      </Content>
    </PageLayout>
  );
};

export default TermsPage; 