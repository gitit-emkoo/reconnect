import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/Layout/PageLayout';
import useAuthStore from '../store/authStore';
import { getDiagnosisHistory } from '../api/diagnosis';
import { DIAGNOSIS_TEMPLATES } from '../templates/diagnosisTemplates';
import BrainIcon from '../assets/Icon_Brain.png';
import ConfirmationModal from '../components/common/ConfirmationModal';

const Badge = styled.span`
  background-color: #ff4d4f;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-right: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
`;

const SubscriberBadge = styled.span`
  background-color: #785cd2;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-right: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
`;

const FreeText = styled.span`
  color:rgb(255, 193, 194);
  font-weight: bold;
`;

const Section = styled.div`
  background: #f9f9f9;
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto 2rem;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  color: #333;
`;

const Icon = styled.img`
  width: 56px;
  height: 56px;
  margin-right: 1.25rem;
`;

const DiagnosisList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DiagnosisItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #fff;
  border-radius: 0.75rem;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    border-color: #7c3aed;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ItemSubtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
  margin-bottom: 0;
`;

const ItemDate = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const ItemScore = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #785cd2;
`;

const NoHistory = styled.p`
  color: #888;
  text-align: center;
  padding: 2rem 0;
  font-style: italic;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ToggleButton = styled.button`
  background: #f0e9ff;
  color: #785cd2;
  border: 1px solid #dcd1f3;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #e5d9f9;
  }
`;

const CTA = styled.button`
  background: linear-gradient(135deg, #8e44ad, #7c3aed);
  color: #fff;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }

  &:disabled {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

interface DiagnosisHistoryItem {
  id: string | number;
  date: string;
  score: number;
  answers?: number[];
}

const SelfDiagnosisRoom: React.FC = () => {
  const navigate = useNavigate();
  const [histories, setHistories] = useState<Record<string, DiagnosisHistoryItem[]>>({});
  const [showAllMap, setShowAllMap] = useState<Record<string, boolean>>({});
  const accessToken = useAuthStore(state=>state.accessToken);
  const user = useAuthStore(state => state.user);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMarriageCompletedModal, setShowMarriageCompletedModal] = useState(false);

  // marriage를 항상 위로 오도록 정렬
  const sortedTemplates = [...DIAGNOSIS_TEMPLATES].sort((a, b) => {
    if (a.id === 'marriage') return -1;
    if (b.id === 'marriage') return 1;
    return 0;
  });

  // 결혼진단 완료 여부 확인
  const hasCompletedMarriageDiagnosis = (histories['marriage']?.length ?? 0) > 0;

  useEffect(() => {
    const init = async () => {
      const resultMap: Record<string, DiagnosisHistoryItem[]> = {};

      // 서버 history만 사용
      if (accessToken) {
        const serverHistory = await getDiagnosisHistory();
        console.log('서버에서 받아온 진단 결과:', serverHistory);
        serverHistory.forEach((d) => {
          // diagnosisType이 없으면 resultType을 fallback으로 사용
          const key = d.diagnosisType || d.resultType;
          const arr = resultMap[key] || [];
          arr.push({
            id: d.id,
            date: new Date(d.createdAt).toLocaleString('ko-KR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'}),
            score: d.score,
          });
          resultMap[key] = arr;
        });
      }

      setHistories(resultMap);
    };
    init();
  }, [accessToken]);

  return (
    <PageLayout title="자기이해 진단실">
      <div style={{fontSize:'0.8rem', color:'#666', marginBottom:'1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef'}}>
        <div style={{fontWeight: 'bold', marginBottom: '0.5rem', color: '#495057'}}>⚠️ 중요 안내</div>
        <div style={{marginBottom: '0.5rem'}}>본 테스트 결과는 상담 및 필요한 법적 자문시 핵심 기초자료로 사용됩니다. 정확한 분석을 위해 솔직하고 있는 그대로 응답해 주세요.</div>
        <div style={{fontSize: '0.75rem', color: '#6c757d', fontStyle: 'italic'}}>
          본 앱은 의료 앱이 아니며, 의학적 진단이나 치료 목적으로 사용되지 않습니다. 
          심각한 심리적 문제가 있다고 생각되시면 전문의와 상담하시기 바랍니다.
        </div>
      </div>
      {sortedTemplates.map((tpl)=>(
        <Section key={tpl.id}>
          <HeaderContainer>
            <Icon src={BrainIcon} alt="진단 아이콘" />
            <TextContainer>
              <Title>{tpl.title}</Title>
              <ItemSubtitle>{tpl.subtitle}</ItemSubtitle>
            </TextContainer>
          </HeaderContainer>
          { (histories[tpl.id]?.length ?? 0) > 0 ? (
            <>
              <DiagnosisList>
                {(showAllMap[tpl.id] ? histories[tpl.id] : histories[tpl.id]?.slice(0,1)).map((item)=>(
                  <DiagnosisItem
                    key={item.id}
                    onClick={()=>{
                      navigate(`/generic-diagnosis-result/${tpl.id}`, { state:{ diagnosis:item } });
                    }}
                  >
                    <ItemInfo>
                      <ItemDate>{item.date}</ItemDate>
                      <ItemScore>{item.score}점</ItemScore>
                    </ItemInfo>
                  </DiagnosisItem>
                ))}
              </DiagnosisList>
              { (histories[tpl.id]?.length ?? 0) > 1 && (
                <ButtonContainer>
                  <ToggleButton onClick={()=>setShowAllMap(prev=>({...prev, [tpl.id]: !prev[tpl.id]}))}>
                    {showAllMap[tpl.id] ? '접기 ▴' : '지난 진단 기록 보기 ▾'}
                  </ToggleButton>
                </ButtonContainer>
              )}
            </>
          ) : (<NoHistory>진단 내역이 없습니다.</NoHistory>)}
          <ButtonContainer>
            <CTA 
              onClick={() => {
                if (tpl.id === 'marriage') {
                  // 결혼진단 완료 여부 확인
                  if (hasCompletedMarriageDiagnosis) {
                    setShowMarriageCompletedModal(true);
                    return;
                  }
                  navigate(`/generic-diagnosis/${tpl.id}`);
                  return;
                }
                if (tpl.id === 'sex') {
                  if (user?.subscriptionStatus === 'SUBSCRIBED') {
                navigate(`/generic-diagnosis/${tpl.id}`);
                  } else {
                    setShowSubscribeModal(true);
                  }
                  return;
                }
                // 그 외 진단은 결제 안내 모달
                setShowPaymentModal(true);
              }}
              disabled={tpl.id === 'marriage' && hasCompletedMarriageDiagnosis}
            >
              {tpl.id === 'marriage' ? (
                hasCompletedMarriageDiagnosis ? (
                  <>
                    <Badge style={{ backgroundColor: '#52c41a' }}>완료</Badge>
                    <span style={{ color: '#52c41a', fontWeight: 'bold' }}>진단 완료됨</span>
                  </>
                ) : (
                  <>
                    <Badge>이벤트</Badge>
                    <FreeText>무료로 시작하기</FreeText>
                  </>
                )
              ) : tpl.id === 'sex' && user?.subscriptionStatus === 'SUBSCRIBED' ? (
                <>
                  <SubscriberBadge>구독자</SubscriberBadge>
                  <FreeText>구독자 무료</FreeText>
                </>
              ) : tpl.id === 'sex' ? (
                <>
                  <SubscriberBadge>구독자</SubscriberBadge>
                  <span>구독자 무료</span>
                </>
              ) : (
                <>
                  <Badge>유료</Badge>
                  <span>{tpl.price}원</span>
                </>
              )}
            </CTA>
          </ButtonContainer>
        </Section>
      ))}
      <ConfirmationModal
        isOpen={showSubscribeModal}
        onRequestClose={() => setShowSubscribeModal(false)}
        onConfirm={() => setShowSubscribeModal(false)}
        title="이용 안내"
        message="무료 구독후 이용 바랍니다."
        confirmButtonText="확인"
        showCancelButton={false}
      />
      <ConfirmationModal
        isOpen={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}
        onConfirm={() => setShowPaymentModal(false)}
        title="이용 안내"
        message="무료 구독후 이용 바랍니다."
        confirmButtonText="확인"
        showCancelButton={false}
      />
      <ConfirmationModal
        isOpen={showMarriageCompletedModal}
        onRequestClose={() => setShowMarriageCompletedModal(false)}
        onConfirm={() => setShowMarriageCompletedModal(false)}
        title="진단 완료"
        message="결혼생활 만족도 진단을 이미 완료하셨습니다. 진단 결과는 관계온도 계산에 사용되며, 한 번만 진행할 수 있습니다."
        confirmButtonText="확인"
        showCancelButton={false}
      />
    </PageLayout>
  );
};

export default SelfDiagnosisRoom; 