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
  background: linear-gradient(135deg, #ff69b4, #785cd2);
  color: #fff;
  border: none;
  padding: 0.7rem 1.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
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

  // marriage를 항상 위로 오도록 정렬
  const sortedTemplates = [...DIAGNOSIS_TEMPLATES].sort((a, b) => {
    if (a.id === 'marriage') return -1;
    if (b.id === 'marriage') return 1;
    return 0;
  });

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
      <div style={{fontSize:'0.8rem', color:'#666', marginBottom:'1rem'}}>본 테스트 결과는 상담 및 필요한 법적 자문시 핵심 기초자료로 사용됩니다. 정확한 분석을 위해 솔직하고 있는 그대로 응답해 주세요.</div>
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
                {(showAllMap[tpl.id] ? histories[tpl.id] : histories[tpl.id]?.slice(0,3)).map((item)=>(
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
              { (histories[tpl.id]?.length ?? 0) > 3 && (
                <ButtonContainer>
                  <ToggleButton onClick={()=>setShowAllMap(prev=>({...prev, [tpl.id]: !prev[tpl.id]}))}>
                    {showAllMap[tpl.id] ? '접기 ▲' : '더보기 ▼'}
                  </ToggleButton>
                </ButtonContainer>
              )}
            </>
          ) : (<NoHistory>진단 내역이 없습니다.</NoHistory>)}
          <ButtonContainer>
            <CTA onClick={() => {
              if (tpl.id !== 'marriage' && user?.subscriptionStatus !== 'SUBSCRIBED') {
                setShowSubscribeModal(true);
                return;
              }
              navigate(`/generic-diagnosis/${tpl.id}`);
            }}>
              {tpl.price === '무료(이벤트)' ? (
                <>
                  <Badge>이벤트</Badge>
                  <FreeText>무료로 시작하기</FreeText>
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
        message="구독하거나 결제 후 이용 바랍니다."
        confirmButtonText="확인"
        showCancelButton={false}
      />
    </PageLayout>
  );
};

export default SelfDiagnosisRoom; 