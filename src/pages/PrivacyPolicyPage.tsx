import React from 'react';
import styled from 'styled-components';
import PageLayout from '../components/Layout/PageLayout';

// TermsPage.tsx의 스타일을 참고하여 유사하게 정의
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
    font-size: 1rem; /* 제목 크기 조정 */
    font-weight: 600;
    color: #333;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eee; /* 제목 하단 구분선 */
  }

  p, li {
    font-size: 0.85rem; /* 본문/목록 크기 조정 */
    color: #555; /* 본문 색상 약간 진하게 */
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
`;

const PrivacyPolicyPage: React.FC = () => {
  return (
    <PageLayout title="개인정보처리방침" showBackButton={true}>
      <Content>
        <Section>
          <p>
            <strong>리커넥트</strong>(이하 "회사")는 이용자의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.
            회사는 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
          </p>
        </Section>

        <Section>
          <h2>제1조 (개인정보의 처리 목적)</h2>
          <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
          <ul>
            <li><strong>홈페이지 회원 가입 및 관리:</strong> 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 각종 고지·통지, 고충처리 등을 목적으로 개인정보를 처리합니다.</li>
            <li><strong>재화 또는 서비스 제공:</strong> 서비스 제공, 콘텐츠 제공, 맞춤 서비스 제공, 요금결제·정산 등을 목적으로 개인정보를 처리합니다.</li>
            <li><strong>마케팅 및 광고에의 활용:</strong> 신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계 등을 목적으로 개인정보를 처리합니다. (선택 동의 시)</li>
          </ul>
        </Section>

        <Section>
          <h2>제2조 (처리하는 개인정보 항목)</h2>
          <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
          <ul>
            <li><strong>필수항목:</strong> 이메일 주소, 비밀번호, 닉네임</li>
            <li><strong>선택항목:</strong> 프로필 이미지, 생년월일, 결혼기념일, 파트너 정보 (연결 시)</li>
            <li>서비스 이용 과정에서 아래 개인정보 항목이 자동으로 생성되어 수집될 수 있습니다: IP주소, 쿠키, 서비스 이용 기록, 방문 기록, 불량 이용 기록 등</li>
          </ul>
        </Section>
        
        <Section>
          <h2>제3조 (개인정보의 처리 및 보유 기간)</h2>
          <p>① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
          <p>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
          <ul>
            <li><strong>회원 가입 및 관리:</strong> 서비스 공급 완료 및 요금 결제·정산 완료 시까지. 다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지
              <ol type="1" style={{marginLeft: '1.5rem', listStyleType: 'decimal'}}>
                <li>관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지</li>
                <li>서비스 이용에 따른 채권·채무관계 잔존 시에는 해당 채권·채무관계 정산 시까지</li>
              </ol>
            </li>
            <li><strong>전자상거래에서의 계약·청약철회, 대금결제, 재화 등 공급기록:</strong> 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
          </ul>
        </Section>

        <Section>
          <h2>제4조 (개인정보의 제3자 제공)</h2>
          <p>회사는 원칙적으로 이용자의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서 처리하며, 이용자의 사전 동의 없이는 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다. 자세한 내용은 "개인정보 제3자 제공 동의" 페이지를 참고해주십시오.</p>
        </Section>

        <Section>
          <h2>제5조 (이용자 및 법정대리인의 권리와 그 행사방법)</h2>
          <p>이용자는 개인정보주체로서 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다. 이는 '마이페이지 &gt; 프로필 설정' 또는 서면, 전자우편 등을 통해 요청할 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
        </Section>

        <Section>
          <h2>제6조 (개인정보의 파기)</h2>
          <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 다음과 같습니다. [상세 파기 절차 설명 필요]</p>
        </Section>
        
        <Section>
          <h2>제7조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</h2>
          <p>회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다. 이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.</p>
        </Section>

        <Section>
          <h2>제8조 (개인정보 보호책임자)</h2>
          <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
          <ul>
            <li><strong>성명:</strong> OOO</li>
            <li><strong>직책:</strong> OOO</li>
            <li><strong>연락처:</strong> [이메일 주소], [전화번호]</li>
          </ul>
        </Section>

        <Section>
          <h2>제9조 (개인정보처리방침 변경)</h2>
          <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
          <p><strong>공고일자:</strong> YYYY년 MM월 DD일</p>
          <p><strong>시행일자:</strong> YYYY년 MM월 DD일</p>
        </Section>

      </Content>
    </PageLayout>
  );
};

export default PrivacyPolicyPage; 