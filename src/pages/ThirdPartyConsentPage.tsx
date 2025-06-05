import React from 'react';
import styled from 'styled-components';
import PageLayout from '../components/Layout/PageLayout';

// PrivacyPolicyPage.tsx와 동일한 스타일 컴포넌트 사용
const Content = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 1rem;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: 2rem;

  h2 {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
  }

  p, li {
    font-size: 0.85rem;
    color: #555;
    line-height: 1.7;
    margin-bottom: 0.75rem;
  }

  ul {
    list-style-type: disc;
    margin-left: 1.5rem;
  }
  
  strong {
    font-weight: 600;
    color: #333;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 0.8rem;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: left;
  }
  th {
    background-color: #f9f9f9;
    font-weight: 600;
  }
`;

const ThirdPartyConsentPage: React.FC = () => {
  return (
    <PageLayout title="개인정보 제3자 제공 동의" showBackButton={true}>
      <Content>
        <Section>
          <p>
            <strong>리커넥트</strong>(이하 "회사")는 이용자의 개인정보를 안전하게 처리하며, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 개인정보보호 관련 법령을 준수하고 있습니다.
            회사는 다음과 같이 개인정보를 제3자에게 제공하고자 합니다. 이용자는 아래 내용을 자세히 읽어보시고, 동의 여부를 결정하여 주시기 바랍니다.
          </p>
        </Section>

        <Section>
          <h2>제1조 (개인정보를 제공받는 자)</h2>
          <p>회사는 이용자의 사전 동의 없이는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음과 같은 경우에 한하여 최소한의 범위 내에서 개인정보를 제공할 수 있습니다.</p>
          {/* 예시: 실제 제공 업체가 있다면 명시 */}
          <p><em>현재 회사는 이용자의 명시적인 동의 없이 개인정보를 제3자에게 제공하고 있지 않습니다. 향후 제3자 제공이 필요한 경우, 본 페이지 또는 별도의 동의 절차를 통해 고지하고 동의를 받을 예정입니다.</em></p>
          
          {/* 만약 실제 제공 업체가 있다면 아래와 같은 표 형태로 명시합니다. */}
          {/* 
          <table>
            <thead>
              <tr>
                <th>제공받는 자</th>
                <th>제공 목적</th>
                <th>제공 항목</th>
                <th>보유 및 이용 기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>(주)OO파트너</td>
                <td>맞춤형 서비스 추천</td>
                <td>닉네임, 서비스 이용 기록 (비식별화)</td>
                <td>동의 철회 또는 서비스 탈퇴 시까지</td>
              </tr>
              <tr>
                <td>XX카드사</td>
                <td>제휴 상품 안내 (마케팅 동의 시)</td>
                <td>이메일 주소</td>
                <td>동의일로부터 1년</td>
              </tr>
            </tbody>
          </table> 
          */}
        </Section>

        <Section>
          <h2>제2조 (개인정보 제공 목적)</h2>
          <p>회사가 개인정보를 제3자에게 제공하는 경우, 그 목적은 다음과 같습니다.</p>
          <ul>
            <li>제휴 서비스 연동 및 제공</li>
            <li>이벤트 진행 및 경품 발송</li>
            <li>고객 문의 응대 및 지원 (필요시 외부 솔루션 사용 등)</li>
            <li>법령상 의무 이행</li>
          </ul>
          <p>각 제공 건에 대한 구체적인 목적은 제1조의 표 또는 별도 동의 시 명시됩니다.</p>
        </Section>

        <Section>
          <h2>제3조 (제공하는 개인정보 항목)</h2>
          <p>제3자에게 제공되는 개인정보 항목은 서비스 제공 및 계약 이행에 필요한 최소한의 정보로 한정됩니다. 구체적인 항목은 제1조의 표 또는 별도 동의 시 명시됩니다.</p>
        </Section>

        <Section>
          <h2>제4조 (개인정보의 보유 및 이용 기간)</h2>
          <p>제3자에게 제공된 개인정보는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다. 구체적인 기간은 제1조의 표 또는 별도 동의 시 명시됩니다.</p>
        </Section>

        <Section>
          <h2>제5조 (동의를 거부할 권리 및 동의 거부에 따른 불이익)</h2>
          <p>이용자는 위와 같은 개인정보의 제3자 제공에 대한 동의를 거부할 수 있습니다. 다만, 동의를 거부하시는 경우 해당 제3자가 제공하는 서비스 이용이 제한되거나, 이벤트 참여 및 경품 수령 등이 불가능할 수 있습니다.</p>
          <p>필수적인 개인정보 제공에 동의하지 않으시는 경우에는 서비스 가입 또는 특정 기능 이용이 제한될 수 있습니다. 선택적인 개인정보 제공에 대한 동의는 거부하시더라도 기본적인 서비스 이용에는 영향이 없습니다.</p>
        </Section>

        <Section>
          <h2>제6조 (문의처)</h2>
          <p>개인정보 제3자 제공과 관련된 문의사항은 회사의 개인정보 보호책임자 또는 고객센터로 연락주시기 바랍니다.</p>
        </Section>

      </Content>
    </PageLayout>
  );
};

export default ThirdPartyConsentPage; 