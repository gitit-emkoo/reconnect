import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/Layout/PageLayout';
import useAuthStore from '../store/authStore';
import { getDiagnosisHistory } from '../api/diagnosis';
import { DIAGNOSIS_TEMPLATES } from '../templates/diagnosisTemplates';

const Section = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
`;

const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const DiagnosisList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
`;

const DiagnosisItem = styled.li`
  margin-bottom: 0.5rem;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const CTA = styled.button`
  background: #7c3aed;
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
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
      {DIAGNOSIS_TEMPLATES.map((tpl)=>(
        <Section key={tpl.id}>
          <Title>{tpl.title}</Title>
          { (histories[tpl.id]?.length ?? 0) > 0 ? (
            <DiagnosisList>
              {(showAllMap[tpl.id] ? histories[tpl.id] : histories[tpl.id]?.slice(0,2)).map((item)=>(
                <DiagnosisItem 
                  key={item.id}
                  onClick={()=>{
                    if (tpl.id === 'marriage') {
                      navigate('/marriage-diagnosis-result', { state:{ diagnosis:item } });
                    } else {
                      navigate(`/generic-diagnosis-result/${tpl.id}`, { state:{ diagnosis:item } });
                    }
                  }}
                >
                  {item.date} - {item.score}점
                </DiagnosisItem>
              ))}
              { (histories[tpl.id]?.length ?? 0) > 2 && (
                <li style={{ marginTop:'0.5rem' }}>
                  <button
                    onClick={()=>setShowAllMap(prev=>({...prev, [tpl.id]: !prev[tpl.id]}))}
                    style={{ background:'none',border:'none',color:'#7c3aed',cursor:'pointer',fontWeight:600 }}>
                    {showAllMap[tpl.id] ? '접기 ▲' : '더보기 ▼'}
                  </button>
                </li>
              )}
            </DiagnosisList>
          ) : (<p>진단 내역이 없습니다.</p>)}

          <CTA onClick={()=>{
            if (tpl.id === 'marriage') {
              navigate('/marriage-diagnosis');
            } else {
              navigate(`/generic-diagnosis/${tpl.id}`);
            }
          }}>새로운 진단 시작하기</CTA>
        </Section>
      ))}
    </PageLayout>
  );
};

export default SelfDiagnosisRoom; 