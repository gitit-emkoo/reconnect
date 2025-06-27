import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/Layout/PageLayout';

const Section = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
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
  id: number;
  date: string;
  score: number;
  answers: number[];
}

const SelfDiagnosisRoom: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<DiagnosisHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('diagnosisHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  return (
    <PageLayout title="자기이해 진단실">
      <Section>
        <Title>자기이해 진단</Title>
        {history.length > 0 ? (
          <DiagnosisList>
            {history.slice(0,3).map((item) => (
              <DiagnosisItem
                key={item.id}
                onClick={() => navigate('/marriage-diagnosis-result', { state: { diagnosis: item } })}
              >
                {item.date} - {item.score}점
              </DiagnosisItem>
            ))}
          </DiagnosisList>
        ) : (
          <p>진단 내역이 없습니다.</p>
        )}

        <CTA onClick={() => navigate('/marriage-diagnosis')}>새로운 진단 시작하기</CTA>
      </Section>
    </PageLayout>
  );
};

export default SelfDiagnosisRoom; 