import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from '../api/axios';
import GoogleIcon from '../assets/btn_google.svg?url';
import AppleIcon from '../assets/btn_apple.svg?url';
import LoadingScreen from '../components/common/LoadingScreen';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(var(--vh, 1vh) * 100);
  min-height: 100dvh;
  background: #fff;
  padding: 1rem;
`;

const SectionHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  color: #4b5563;
  margin: 0.5rem 0 1rem;
`;


const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #f1f1f3;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.04);
`;

const Pill = styled.span<{ $level: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  background: ${({ $level }) =>
    $level === '매우 위험' ? '#ef4444' :
    $level === '위험' ? '#f97316' :
    $level === '주의' ? '#f59e0b' :
    $level === '양호' ? '#22c55e' : '#14b8a6'};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Small = styled.small`
  color: #6b7280;
`;

const Message = styled.p`
  font-size: 0.95rem;
  color: #444;
  line-height: 1.6;
  margin: 10px 0 0;
`;

const Chart = styled.div`
  margin-top: 12px;
  background: #fafafa;
  border: 1px solid #f1f1f3;
  border-radius: 12px;
  padding: 10px;
`;

const Bars = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  height: 160px;
  position: relative;
  padding: 0 8px;
`;

const BenchSvg = styled.svg`
    position: absolute;
    left: 0;
  bottom: 0;
  width: 100%;
  height: 160px;
  pointer-events: none;
`;

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
    height: 100%;
  gap: 6px;
`;

const BarRect = styled.div<{ $h: number; $animate?: boolean; $delayMs?: number }>`
  width: 18px;
  height: ${p => (p.$animate ? p.$h : 0)}%;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 8px 8px 0 0;
  transition: height 600ms ease;
  transition-delay: ${p => (p.$delayMs ? `${p.$delayMs}ms` : '0ms')};
`;

const BarLabel = styled.div`
  font-size: 0.7rem;
  color: #6b7280;
  text-align: center;
`;

const SummaryBox = styled.div`
  margin-top: 14px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
`;

const OverallRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

type Level = '매우 위험' | '위험' | '주의' | '양호' | '매우 양호';

const SECTION_TITLES = [
  '정서적 안정성',
  '긍정 정서 결핍도',
  '자기인식·자기수용',
  '대인관계·사회적 연결감',
  '회복 탄력성',
  '감정 조절 능력',
  '동기·에너지 저하',
];

// 하드코딩한 벤치마크 평균(5점 척도) – 사용자 수가 늘면 서버값으로 대체 예정
const BENCHMARKS: number[] = [2.3, 3.2, 1.5, 3.4, 3.9, 2.8, 3.1];

const classify = (section: string, score: number): { level: Level; message: string } => {
  const rangeToLevel = (s: number): Level =>
    s >= 21 ? '매우 위험' : s >= 16 ? '위험' : s >= 11 ? '주의' : s >= 6 ? '양호' : '매우 양호';

  const messages: Record<string, Record<Level, string>> = {
    '정서적 안정성': {
      '매우 위험': '감정 기복이 심하고, 분노·불안 반응이 자주 나타납니다. 일상 기능에 영향을 줄 수 있으며 전문가 상담이 필요합니다.',
      '위험': '감정 조절에 어려움이 있으며, 스트레스 상황에서 불안정한 반응이 나타납니다. 주의가 필요합니다.',
      '주의': '감정 기복이 간헐적으로 나타나며, 상황에 따라 불안정성이 증가할 수 있습니다.',
      '양호': '대체로 감정이 안정적이며, 스트레스에 대한 반응도 적절한 편입니다.',
      '매우 양호': '감정적으로 매우 안정된 상태이며, 부정적 감정 반응이 거의 없습니다.',
    },
    '긍정 정서 결핍도': {
      '매우 위험': '긍정적인 감정 경험이 거의 없으며, 우울감과 무기력이 지속될 수 있습니다. 즉각적인 심리적 개입이 필요합니다.',
      '위험': '삶의 만족감이 낮고, 희망이나 감사의 감정이 부족합니다. 정서적 회복력이 저하된 상태입니다.',
      '주의': '긍정 정서가 제한적으로 나타나며, 일상에서 의미를 느끼기 어려운 순간이 있습니다.',
      '양호': '긍정적인 감정을 간헐적으로 경험하며, 일상에서 즐거움과 의미를 느낄 수 있습니다.',
      '매우 양호': '삶에 대한 만족감과 긍정적인 감정이 풍부하며, 정서적 활력이 높습니다.',
    },
    '자기인식·자기수용': {
      '매우 위험': '자기 인식과 수용 능력이 매우 낮으며, 자기 부정적 사고가 강하게 나타납니다.',
      '위험': '감정 인식과 자기 존중에 어려움이 있으며, 자기 비판이 강한 경향이 있습니다.',
      '주의': '자기 인식이 다소 부족하거나 감정 이해에 혼란이 있을 수 있습니다.',
      '양호': '자기 인식이 양호하며, 감정에 대한 이해와 수용이 잘 이루어지고 있습니다.',
      '매우 양호': '자신의 감정을 명확히 인식하고 있으며, 자기 수용과 존중이 높은 상태입니다.',
    },
    '대인관계·사회적 연결감': {
      '매우 위험': '심각한 외로움과 관계 단절이 나타나며, 사회적 지원이 절실히 필요합니다.',
      '위험': '사회적 연결감이 약화되어 있으며, 정서적 고립이 우려됩니다.',
      '주의': '관계에서 거리감을 느끼거나 감정 공유가 제한적일 수 있습니다.',
      '양호': '대인관계에서 만족감을 느끼며, 감정 공유와 공감 능력이 양호합니다.',
      '매우 양호': '타인과의 정서적 연결이 강하며, 안정적인 사회적 관계를 유지하고 있습니다.',
    },
    '회복 탄력성': {
      '매우 위험': '정서적 회복이 거의 이루어지지 않으며, 지속적인 낙담 상태가 나타날 수 있습니다.',
      '위험': '회복탄력성이 낮아 어려움을 극복하는 데 어려움을 겪습니다.',
      '주의': '회복력이 다소 부족하며, 좌절 후 재기까지 시간이 걸릴 수 있습니다.',
      '양호': '회복탄력성이 양호하며, 실패나 스트레스 상황에서도 긍정적인 태도를 유지합니다.',
      '매우 양호': '어려움 속에서도 빠르게 회복하며, 매우 강한 정서적 회복력을 보입니다.',
    },
    '감정 조절 능력': {
      '매우 위험': '감정 조절 능력이 매우 부족하며, 정서적 폭발이나 억제가 심각할 수 있습니다. 전문가의 개입이 필요합니다.',
      '위험': '감정 조절이 어려워 대인관계나 행동에 영향을 줄 수 있습니다.',
      '주의': '감정 표현이나 조절에 다소 어려움이 있으며, 억제하거나 과잉 표현하는 경향이 있습니다.',
      '양호': '감정 조절 능력이 양호하며, 일상에서 감정을 잘 다루고 있습니다.',
      '매우 양호': '감정을 매우 효과적으로 조절하고 표현하며, 건강한 정서 표현이 가능합니다.',
    },
    '동기·에너지 저하': {
      '매우 위험': '심각한 무기력 상태이며, 우울증 가능성이 높습니다. 즉각적인 심리적 개입이 필요합니다.',
      '위험': '에너지 수준이 낮고, 일상생활에서 동기 부족이 지속될 수 있습니다.',
      '주의': '무기력하거나 의욕 저하가 간헐적으로 나타납니다.',
      '양호': '동기와 에너지가 양호하며, 목표 지향적인 행동이 잘 이루어지고 있습니다.',
      '매우 양호': '삶에 대한 의욕과 에너지가 매우 높으며, 활력 있는 일상을 유지하고 있습니다.',
    },
  };

  const level = rangeToLevel(score);
  return { level, message: messages[section][level] };
};



const ActionButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 30px;
  background: #785cd2;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    background: #c5b8e3;
    cursor: not-allowed;
  }
`;

const AndroidButton = styled(ActionButton)`
  background: #ffffff;
  color: #202124;
  border: 1px solid #dadce0;
`;

const IosButton = styled(ActionButton)`
  background: #000000;
  color: #ffffff;
  img { filter: invert(1) brightness(1.8) contrast(1.1); }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 3rem;

  ${ActionButton} {
    width: auto;
    flex: 1;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const PromoContainer = styled.div`
  background: linear-gradient(135deg, #FFE5E5 0%, #E5E5FF 100%);
  padding: 20px;
  border-radius: 12px;
  margin: 1rem 0 1rem;
`;

const PromoTitle = styled.h3`
  color: #785cd2;
  margin-bottom: 15px;
  font-size: 1.3rem;
  font-weight: bold;
`;

const PromoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.95rem;
  color: #555;
`;

const PromoListItem = styled.li`
  margin-bottom: 8px;
`;

const PromoCTA = styled.p`
  font-size: 1rem;
  color: #FF69B4;
  font-weight: bold;
  text-align: center;
  margin: 12px 0 0;
`;

const IconImage = styled.img`
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-right: 6px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
`;

const LoadingIcon = styled.div`
  width: 24px;
  height: 24px;
`;

const ReconnectMeaningContainer = styled.div`
  background: #f0f9eb; /* 연한 초록색 배경 */
  border: 1px solid #a5d6a7; /* 연한 초록색 테두리 */
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 1rem;
  text-align: center;
`;

const ReconnectMeaningTitle = styled.h4`
  color: #2e7d32; /* 진한 초록색 제목 */
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ReconnectMeaningText = styled.p`
  color: #388e3c; /* 진한 초록색 텍스트 */
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
`;


// 온도 기반 결과 로직은 사용하지 않습니다.

const BaselineDiagnosisResult: React.FC = () => {
  const location = useLocation();
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  // 로딩 완료 후 결과 페이지 표시
  const handleLoadingComplete = () => {
    console.log('로딩 완료, 결과 페이지로 전환');
    setShowLoading(false);
  };

  // 결과 화면 새로고침/직접 진입 대비: state가 없으면 로컬스토리지에서 복구
  const answers = useMemo(() => {
    let stateAnswers: number[] = (location.state && (location.state as any).answers) || [];
    if (!Array.isArray(stateAnswers) || stateAnswers.length === 0) {
      try {
        const saved = localStorage.getItem('baselineDiagnosisAnswers');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.answers)) {
            stateAnswers = parsed.answers as number[];
          }
        }
      } catch {}
    }
    return stateAnswers;
  }, [location.state]);

  const sections = useMemo(() => {
    if (!answers || answers.length === 0) return [];
    
    const res: Array<{ title: string; score: number; avg: number; level: Level; message: string }> = [];
    for (let i = 0; i < 7; i++) {
      const start = i * 5;
      const slice = answers.slice(start, start + 5).map(v => (typeof v === 'number' ? v : 0));
      const sum = slice.reduce((s, v) => s + v, 0);
      const avg = slice.length ? sum / slice.length : 0;
      const title = SECTION_TITLES[i];
      const { level, message } = classify(title, sum);
      res.push({ title, score: sum, avg, level, message });
    }
    return res;
  }, [answers]);

  // (구) 직선 평균선은 제거. BENCHMARKS를 꺾은선으로 표시.
  const [animateBars, setAnimateBars] = useState(false);
  useEffect(() => {
    setAnimateBars(false);
    const t = setTimeout(() => setAnimateBars(true), 60);
    return () => clearTimeout(t);
  }, [sections]);

  const summaryText = useMemo(() => {
    if (!sections || sections.length === 0) return '';
    
    const risks = sections.filter(s => s.level === '매우 위험' || s.level === '위험');
    const cautions = sections.filter(s => s.level === '주의');
    const strengths = sections.filter(s => s.level === '양호' || s.level === '매우 양호');

    const OPENERS: Record<string, string> = {
      '정서적 안정성': '최근 감정 기복이나 불안으로 스스로가 버거웠을 수 있어요. 많이 힘드셨죠.',
      '긍정 정서 결핍도': '기쁨이나 만족감이 잘 느껴지지 않아 하루가 무겁게 느껴졌을 수 있어요.',
      '자기인식·자기수용': '내 감정을 정확히 이해하고 스스로를 받아들이는 일이 쉽지 않았을 수 있어요.',
      '대인관계·사회적 연결감': '평소 "혼자"라는 느낌이 잦았을 수 있어요. 마음 놓고 기대기 어려웠을지도요.',
      '회복 탄력성': '힘든 경험에서 회복하는 데 시간이 오래 걸려 지칠 수 있었어요.',
      '감정 조절 능력': '감정이 올라올 때 조절이 어려워 관계나 일상에 부담이 됐을 수 있어요.',
      '동기·에너지 저하': '에너지가 바닥나 하루를 견디는 것만으로도 벅찼을 수 있어요.',
    };

    const TIPS: Record<string, string[]> = {
      '정서적 안정성': ['감정이름 붙이기("나는 지금 당황/답답함을 느껴")를 1일 1회', '루틴 호흡 3분(4-4-6 호흡)으로 신체 각성 낮추기'],
      '긍정 정서 결핍도': ['잠들기 전 "오늘 괜찮았던 1가지" 기록', '짧은 햇빛 산책 10분으로 기분 활성화'],
      '자기인식·자기수용': ['감정 발생 상황-느낌-욕구를 3줄로 메모', '스스로에게 "그럴 수 있어" 한 문장 허용 연습'],
      '대인관계·사회적 연결감': ['신뢰 가능한 1인에게 안부/감사 메시지 보내기', '대화는 사실-느낌-요청 순서로 3분만'],
      '회복 탄력성': ['하루 1회 "작은 성취" 체크', '힘들 땐 20분 휴식 후 재시도(타임아웃 규칙)'],
      '감정 조절 능력': ['감정이 7/10 이상이면 대화 잠시 중단, 물 한 잔 후 재개', '감정일기 5문장으로 감정 배출'],
      '동기·에너지 저하': ['할 일을 5분 조각내서 착수(시작 난이도 최소화)', '기상 후 30분 안에 가벼운 스트레칭'],
    };

    const riskText = risks.length
      ? `주의가 필요한 영역: ${risks.map(r => `${r.title}(${r.level})`).join(', ')}`
      : '특별한 위험 신호는 낮습니다.';
    const cautionText = cautions.length ? `관찰이 필요한 영역: ${cautions.map(c => c.title).join(', ')}` : '';
    const strengthText = strengths.length ? `강점 영역: ${strengths.map(s => s.title).join(', ')}` : '';

    const top = (risks[0] || cautions[0]);
    const opener = top ? OPENERS[top.title] : '스스로를 돌보려는 지금의 선택만으로도 이미 큰 진전이에요.';
    const tips = top ? TIPS[top.title].map(t => `• ${t}`).join('\n') : '• 오늘 하루 "괜찮았던 1가지"를 기록해 보세요.';

    return [
      opener,
      riskText,
      cautionText,
      strengthText,
      '',
      '도움이 될 실천 제안',
      tips,
    ].filter(Boolean).join('\n');
  }, [sections]);

  // 서버 LLM 요약
  const fetchAiSummary = async () => {
    try {
      setLoadingAI(true);
      const res = await axiosInstance.post<{ summary: string }>(`/diagnosis/ai/summary`, { sections });
      setAiSummary(typeof res.data?.summary === 'string' ? res.data.summary : null);
    } catch (error: any) {
      setAiSummary(null);
    } finally {
      setLoadingAI(false);
    }
  };

  // 최초 1회 자동 호출 (answers가 존재할 때만)
  useEffect(() => {
    if (!answers || (Array.isArray(answers) && answers.length === 0)) return;
    fetchAiSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  // 로딩 화면 표시 중일 때
  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // answers가 없으면 기본 페이지로 리다이렉트
  if (!answers || answers.length === 0) {
    return (
      <Container>
        <SectionHeader>진단 데이터를 찾을 수 없습니다</SectionHeader>
        <p>진단을 다시 진행해주세요.</p>
      </Container>
    );
  }

  console.log('현재 answers:', answers);
  console.log('answers 길이:', answers.length);

  return (
    <Container>
      <SectionHeader>EmoMap 감정지도 진단</SectionHeader>
      <Grid>
        {sections.map((s, idx) => (
          <Card key={idx}>
            <Row>
              <strong>{idx + 1}. {s.title}</strong>
              <Pill $level={s.level}>{s.level}</Pill>
            </Row>
            <Small>점수 {s.score} / 25 </Small>
            <Message>{s.message}</Message>
          </Card>
        ))}
      </Grid>

      <Chart>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <strong>섹션별 평균 점수</strong>
          <Small>회색 점선 = 전체 평균 </Small>
        </div>
        <Bars>
          {/* 벤치마크 꺾은선 */}
          <BenchSvg viewBox="0 0 100 160" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="2 2"
              points={(() => {
                const n = BENCHMARKS.length;
                return BENCHMARKS.map((v, idx) => {
                  const x = (idx / (n - 1)) * 100;
                  const y = 160 - (Math.max(0, Math.min(5, v)) / 5) * 160;
                  return `${x},${y}`;
                }).join(' ');
              })()}
            />
          </BenchSvg>
          {sections.map((s, i) => (
            <Bar key={i}>
              <BarRect $h={(s.avg / 5) * 100} $animate={animateBars} $delayMs={i * 80} />
              <BarLabel>{i + 1}</BarLabel>
            </Bar>
          ))}
        </Bars>
      </Chart>

      <SummaryBox>
        <OverallRow>
          <strong>분석결과</strong>
          {/* 종합 위험도 표시 */}
          <span style={{ fontSize: 12, color: '#6b7280' }}>종합 위험도: {(() => {
            const riskCount = sections.filter(s => s.level === '매우 위험').length * 2 + sections.filter(s => s.level === '위험').length;
            // 0~2 매우 낮음, 3~4 낮음, 5~6 보통, 7~8 높음, 9+ 매우 높음 (섹션 7개 기준 대략적 스케일)
            const scale = riskCount >= 9 ? '매우 높음' : riskCount >= 7 ? '높음' : riskCount >= 5 ? '보통' : riskCount >= 3 ? '낮음' : '매우 낮음';
            return scale;
          })()}</span>
        </OverallRow>
        <Message style={{ marginTop: 8, whiteSpace: 'pre-line' }}>
          {loadingAI ? (
            <LoadingContainer>
              <LoadingIcon>
                <DotLottieReact
                  src="https://lottie.host/3bc0feb9-c94e-42d4-aba2-e89b32c682ac/5vwWH6Nrsh.lottie"
                  loop
                  autoplay
                />
              </LoadingIcon>
              분석결과 생성 중…
            </LoadingContainer>
          ) : (
            aiSummary || summaryText
          )}
        </Message>
      </SummaryBox>

      {/* 리커넥트 의미 설명 */}
      <ReconnectMeaningContainer>
        <ReconnectMeaningTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px' }}>
              <DotLottieReact
                src="https://lottie.host/3bc0feb9-c94e-42d4-aba2-e89b32c682ac/5vwWH6Nrsh.lottie"
                loop
                autoplay
              />
            </div>
            리커넥트를 시작했다는 것은
          </div>
        </ReconnectMeaningTitle>
        <ReconnectMeaningText>
          당신의 감정을 안전하게 기록하고 분석해 지속적인 자기 성장과 관계 발전을 만들어 간다는 의미입니다.
        </ReconnectMeaningText>
      </ReconnectMeaningContainer>

      {/* 프로모션 영역 + 스토어 버튼 */}
            <PromoContainer>
              <PromoTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '24px', height: '24px' }}>
                    <DotLottieReact
                      src="https://lottie.host/3bc0feb9-c94e-42d4-aba2-e89b32c682ac/5vwWH6Nrsh.lottie"
                      loop
                      autoplay
                    />
                  </div>
                  무료혜택이 준비되어 있어요!
                </div>
              </PromoTitle>
              <PromoList>
                <PromoListItem>✅ 결혼생활 진단</PromoListItem>
                <PromoListItem>✅ 디지털 부부합의서 인증 및 발행(무제한)</PromoListItem>
                <PromoListItem>✅ 간편 감정일기 분석리포트(감정트랙) </PromoListItem>
              </PromoList>
              <PromoCTA>지금 바로 나와 우리의 관계를 더 깊고 건강하게 만들어 보세요! 💖</PromoCTA>
            </PromoContainer>
            <ButtonsRow>
        <AndroidButton onClick={() => window.open('https://play.google.com/store/apps/details?id=com.reconnect.kwcc', '_blank', 'noopener,noreferrer')}>
                <IconImage src={GoogleIcon} alt="Google" />
          플레이스토어
              </AndroidButton>
        <IosButton onClick={() => window.open('https://apps.apple.com/app/id6749503525', '_blank', 'noopener,noreferrer')}>
                <IconImage src={AppleIcon} alt="Apple" />
          앱스토어
              </IosButton>
            </ButtonsRow>
    </Container>
  );
};

export default BaselineDiagnosisResult; 