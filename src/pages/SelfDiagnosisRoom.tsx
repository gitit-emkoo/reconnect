import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/Layout/PageLayout';
import useAuthStore from '../store/authStore';
import { getDiagnosisHistory } from '../api/diagnosis';
import { DIAGNOSIS_TEMPLATES } from '../templates/diagnosisTemplates';

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

const Strikethrough = styled.span`
  text-decoration: line-through;
  color: #aaa;
  margin: 0 0.5rem;
  font-weight: normal;
`;

const FreeText = styled.span`
  color: #ff4d4f;
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

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #333;
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

const ItemDate = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const ItemScore = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #7c3aed;
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
  color: #7c3aed;
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
  padding: 0.9rem 1.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  font-size: 1.1rem;
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
  const token = useAuthStore(state=>state.token);

  // marriage를 항상 위로 오도록 정렬
  const sortedTemplates = [...DIAGNOSIS_TEMPLATES].sort((a, b) => {
    if (a.id === 'marriage') return -1;
    if (b.id === 'marriage') return 1;
    return 0;
  });

  useEffect(() => {
    const init = async () => {
      const resultMap: Record<string, DiagnosisHistoryItem[]> = {};

      // 서버 history if login
      if (token) {
        const serverHistory = await getDiagnosisHistory();
        serverHistory.forEach((d) => {
          const arr = resultMap[d.resultType] || [];
          arr.push({
            id: d.id,
            date: new Date(d.createdAt).toLocaleString('ko-KR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'}),
            score: d.score,
          });
          resultMap[d.resultType] = arr;
        });
      }

      // localStorage fallback for each template
      DIAGNOSIS_TEMPLATES.forEach((tpl) => {
        const key = `diagnosisHistory_${tpl.id}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          const arr = JSON.parse(stored);
          if (!resultMap[tpl.id]) resultMap[tpl.id] = arr;
        }
      });

      setHistories(resultMap);
    };
    init();
  }, [token]);

  return (
    <PageLayout title="자기이해 진단실">
      {sortedTemplates.map((tpl)=>(
        <Section key={tpl.id}>
          <Title>📝 {tpl.title}</Title>
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
            <CTA onClick={()=>{
              navigate(`/generic-diagnosis/${tpl.id}`);
            }}>
              {tpl.id === 'marriage' ? (
                <>
                  <span>이벤트 한정</span>
                  <Strikethrough>100,000원</Strikethrough>
                  <FreeText>무료!</FreeText>
                </>
              ) : (
                <>
                  <Badge>유료</Badge>
                  <span>2,900원에 시작하기</span>
                </>
              )}
            </CTA>
          </ButtonContainer>
        </Section>
      ))}
    </PageLayout>
  );
};

export default SelfDiagnosisRoom; 