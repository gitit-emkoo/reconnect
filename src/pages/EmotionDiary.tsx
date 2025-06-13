import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import BackButton from "../components/common/BackButton";
import EmotionDiaryCalendar from './EmotionDiaryCalendar';
import Popup from '../components/common/Popup';
import EmotionImagePreview, { generateRandomInfo, PaletteItem, convertToPaletteItem } from '../components/EmotionImagePreview';

// SVG 아이콘 임포트
import { ReactComponent as TriggerActivitiesIcon } from "../assets/Trigger_Activities.svg";
import { ReactComponent as TriggerFamilyIcon } from "../assets/Trigger_Family.svg";
import { ReactComponent as TriggerFriendIcon } from "../assets/Trigger_Friend.svg";
import { ReactComponent as TriggerHealthIcon } from "../assets/Trigger_Health.svg";
import { ReactComponent as TriggerIndependenceIcon } from "../assets/Trigger_Independence.svg";
import { ReactComponent as TriggerNewsIcon } from "../assets/Trigger_News.svg";
import { ReactComponent as TriggerParticipationIcon } from "../assets/Trigger_Participation.svg";
import { ReactComponent as TriggerRelationshipsIcon } from "../assets/Trigger_Relationships.svg";
import { ReactComponent as TriggerSelfIcon } from "../assets/Trigger_Self.svg";
import { ReactComponent as TriggerWorkIcon } from "../assets/Trigger_Work.svg";

// 데이터 타입 정의
interface Emotion {
  name: string;
  color: string;
}

interface Trigger {
  name: string;
  IconComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface EmotionElement extends Emotion {
  type: 'emotion';
}

interface TriggerElement extends Trigger {
  type: 'trigger';
}

type Element = EmotionElement | TriggerElement;

interface DiaryEntry {
  date: string;
  emotion: any;
  triggers: any[];
  comment: string;
  palette: PaletteItem[];
  randomInfo: any[];
}

// 스타일 컴포넌트 정의
const Container = styled.div`
  padding: 2rem;
  background-color: #fff;
  min-height: calc(100vh - 60px);
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  padding-bottom: 80px;
  padding-top: 80px; /* 뒤로가기 버튼을 위한 여백 추가 */

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 2rem;
  }
`;

const MainContent = styled.div`
  @media (min-width: 1024px) {
    grid-column: 1;
  }
`;

const PreviewSection = styled.div<{ isExpanded: boolean }>`
  @media (max-width: 1023px) {
    position: fixed;
    bottom: ${({ isExpanded }) => isExpanded ? '100px' : '120px'};
    right: ${({ isExpanded }) => isExpanded ? '0' : '20px'};
    left: ${({ isExpanded }) => isExpanded ? '0' : 'auto'};
    width: ${({ isExpanded }) => isExpanded ? '100%' : '100px'};
    height: ${({ isExpanded }) => isExpanded ? 'calc(100% - 160px)' : '100px'};
    background: white;
    border-radius: ${({ isExpanded }) => isExpanded ? '16px 16px 0 0' : '16px'};
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    z-index: 1000;
  }

  @media (min-width: 1024px) {
    grid-column: 2;
    position: sticky;
    top: 2rem;
    height: fit-content;
  }
`;

const StepContainer = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const StepTitle = styled.h3`
  color:rgb(47, 47, 47);
  font-size: 1.2rem;
`;

const SelectionGrid = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  margin: 1rem 0;
  padding: 0.5rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const EmotionSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const EmotionLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
  text-align: center;
`;

const ColorDot = styled.button<{ color: string; selected: boolean }>`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  border: 3px solid ${({ selected }) => selected ? '#000' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const PreviewContainer = styled.div<{ isExpanded: boolean }>`
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  height: 100%;
  
  @media (max-width: 1023px) {
    ${({ isExpanded }) => !isExpanded && `
      padding: 0.5rem;
      svg {
        width: 80px;
        height: 80px;
      }
      h3 {
        display: none;
      }
      button {
        display: none;
      }
    `}
  }

  svg {
    max-width: 200px;
    height: auto;
  }
`;

const PreviewTitle = styled.h3<{ isExpanded: boolean }>`
  color:rgb(45, 45, 45);
  margin-bottom: 1rem;
  font-size: 1rem;
  text-align: center;

  @media (max-width: 1023px) {
    display: ${({ isExpanded }) => isExpanded ? 'block' : 'none'};
  }
`;

const ExpandButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const MessageInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 2px solid #e5e5e5;
  border-radius: 0.75rem;
  resize: vertical;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #f59e0b;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  background-color: ${({ variant }) => 
    variant === 'primary' ? '#f59e0b' : '#ef4444'};
  color: white;

  &:hover {
    background-color: ${({ variant }) => 
      variant === 'primary' ? '#d97706' : '#dc2626'};
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 90%;
  width: 500px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.5rem;

  h2 {
    margin: 0;
  }
`;

const ModalTitle = styled.h2`
  color: #78350f;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
`;

const ModalMessage = styled.p`
  margin: 0;
  color: #666;
  font-size: 1rem;
  width: 100%;
  text-align: center;
`;

// 감정 데이터 정의
const emotions: Emotion[] = [
  { name: "행복", color: "#FFE179" },       // 노랑
  { name: "사랑", color: "#FFB3C6" },       // 분홍
  { name: "평온", color: "#A6E3E9" },      // 파랑
  { name: "슬픔", color: "#B8C9F0" },      // 연한 파랑
  { name: "화남", color: "#FF8A80" },      // 빨강
  { name: "불안함", color: "#D7BCE8" },    // 보라
  { name: "신남", color: "#FFBC8C" },      // 주황
  { name: "외로움", color: "#a4d1eb" },   // 연한 파랑
  { name: "감사함", color: "#F7C9B6" },    // 연한 노랑
  { name: "무감각함함", color: "#DADADA" }, // 회색
  
];

const triggers: Trigger[] = [
  { name: "활동", IconComponent: TriggerActivitiesIcon },
  { name: "가족", IconComponent: TriggerFamilyIcon },
  { name: "친구", IconComponent: TriggerFriendIcon },
  { name: "건강", IconComponent: TriggerHealthIcon },
  { name: "파트너", IconComponent: TriggerIndependenceIcon },
  { name: "사회", IconComponent: TriggerNewsIcon },
  { name: "참여", IconComponent: TriggerParticipationIcon },
  { name: "관계", IconComponent: TriggerRelationshipsIcon },
  { name: "정체성", IconComponent: TriggerSelfIcon },
  { name: "일", IconComponent: TriggerWorkIcon },
];

// 랜덤 아트 썸네일 컴포넌트
const palette = [
  "#90caf9", "#f48fb1", "#ffd54f", "#a5d6a7", "#ce93d8", "#ffb74d", "#b2dfdb", "#e1bee7"
];
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const RandomArtCircle: React.FC<{ size?: number; shapeCount?: number }> = ({ size = 120, shapeCount = 4 }) => {
  // 랜덤 도형 정보 생성
  const shapes = Array.from({ length: shapeCount }).map((_) => {
    const type = Math.random() > 0.5 ? "circle" : "line";
    const color = palette[getRandomInt(0, palette.length - 1)];
    if (type === "circle") {
      return {
        type,
        cx: getRandomInt(20, size - 20),
        cy: getRandomInt(20, size - 20),
        r: getRandomInt(12, 28),
        fill: color,
        opacity: Math.random() * 0.5 + 0.5
      };
    } else {
      return {
        type,
        x1: getRandomInt(10, size - 10),
        y1: getRandomInt(10, size - 10),
        x2: getRandomInt(10, size - 10),
        y2: getRandomInt(10, size - 10),
        stroke: color,
        strokeWidth: getRandomInt(2, 6),
        opacity: Math.random() * 0.5 + 0.5
      };
    }
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 원형 배경 */}
      <circle cx={size/2} cy={size/2} r={size/2} fill={palette[getRandomInt(0, palette.length - 1)]} />
      {/* 랜덤 도형들 */}
      {shapes.map((shape, i) =>
        shape.type === "circle" ? (
          <circle
            key={i}
            cx={shape.cx}
            cy={shape.cy}
            r={shape.r}
            fill={shape.fill}
            opacity={shape.opacity}
          />
        ) : (
          <line
            key={i}
            x1={shape.x1}
            y1={shape.y1}
            x2={shape.x2}
            y2={shape.y2}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            opacity={shape.opacity}
            strokeLinecap="round"
          />
        )
      )}
    </svg>
  );
};

// 트리거 선택 그리드 및 칩 스타일 추가
const TriggerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem 0;
  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TriggerCard = styled.button<{ selected: boolean }>`
  background: ${({ selected }) => (selected ? '#e9d5ff' : '#dadada')};
  border: 2px solid ${({ selected }) => (selected ? '#a78bfa' : '#e0e0e0')};
  border-radius: 1rem;
  padding: 1.2rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: ${({ selected }) => (selected ? '0 2px 8px #a78bfa33' : 'none')};
  transition: all 0.2s;
  cursor: pointer;
  svg {
    width: 36px;
    height: 36px;
    margin-bottom: 0.5rem;
  }
  font-size: 1rem;
  font-weight: 500;
`;

const SelectedChips = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const Chip = styled.div`
  background: #e9d5ff;
  color: #78350f;
  border-radius: 1rem;
  padding: 0.3rem 0.8rem;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
`;

// 감정카드보내기 스타일 참고: 타이틀+뒤로가기 버튼 헤더
const PageHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 1.5rem auto;
  position: relative;
`;

const StyledBackButton = styled(BackButton)`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;

const PageTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color:rgb(38, 38, 38);
  text-align: center;
  margin: 0;
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

// 메인 컴포넌트
const EmotionDiary: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [diaryList, setDiaryList] = useState<DiaryEntry[]>([]);
  const [showPopup, setShowPopup] = useState(true);

  const handleReset = () => {
    setSelectedEmotion(null);
    setSelectedElements([]);
    setMessage("");
  };

  const handleSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const paletteItems = getPaletteItems();
    const randomInfo = generateRandomInfo(paletteItems);
    setDiaryList([
      ...diaryList,
      {
        date: dateStr,
        emotion: selectedEmotion,
        triggers: selectedElements.filter(e => e.type === 'trigger') as any[],
        comment: message,
        palette: paletteItems,
        randomInfo: randomInfo,
      }
    ]);
    setShowConfirmModal(false);
    handleReset();
  };

  const togglePreview = () => {
    setIsPreviewExpanded(!isPreviewExpanded);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getPaletteItems = (): PaletteItem[] => {
    const items: PaletteItem[] = [];
    if (selectedEmotion) {
      items.push({
        type: 'emotion',
        data: selectedEmotion
      });
    }
    items.push(...selectedElements.map(convertToPaletteItem));
    return items;
  };

  const paletteItems = getPaletteItems();
  const randomInfo = React.useMemo(() => generateRandomInfo(paletteItems), [JSON.stringify(paletteItems)]);

  return (
    <>
    <Popup isOpen={showPopup} onClose={() => setShowPopup(false)}>
      <div style={{ whiteSpace: 'pre-line', fontSize: '1.1rem', fontWeight: 500 }}>
        {`매일매일 작성하는 1분 감정다이어리는\n감정 기록과 전문가에 보다 더 정확할 솔루션을 받을 수 있어요`}
      </div>
    </Popup>
      <Container>
        <PageHeaderContainer>
          <StyledBackButton onClick={handleBack} />
          <PageTitle>감정 다이어리 작성</PageTitle>
        </PageHeaderContainer>
        <MainContent>
          <StepContainer>
            <StepTitle>오늘은 어땠나요?</StepTitle>
            <SelectionGrid>
              {emotions.map((emotion) => (
                <EmotionSelectWrapper key={emotion.name}>
                  <ColorDot
                    color={emotion.color}
                    selected={selectedEmotion?.name === emotion.name}
                    onClick={() => setSelectedEmotion(emotion)}
                  />
                  <EmotionLabel>{emotion.name}</EmotionLabel>
                </EmotionSelectWrapper>
              ))}
            </SelectionGrid>
          </StepContainer>

          <StepContainer>
            <StepTitle>오늘의 감정요소들 선택하기 (최대 3개)</StepTitle>
            {/* 선택된 감정요소 칩 */}
            <SelectedChips>
              {selectedElements.filter(e => e.type === 'trigger').map((trigger) => (
                <Chip key={trigger.name} onClick={() => setSelectedElements(selectedElements.filter(e => !(e.type === 'trigger' && e.name === trigger.name)))}>
                  {trigger.name} ✕
                </Chip>
              ))}
            </SelectedChips>
            {/* 트리거 카드형 그리드 */}
            <TriggerGrid>
              {triggers.map((trigger) => (
                <TriggerCard
                  key={trigger.name}
                  selected={selectedElements.some(e => e.type === 'trigger' && e.name === trigger.name)}
                  onClick={() => {
                    const already = selectedElements.some(e => e.type === 'trigger' && e.name === trigger.name);
                    if (already) {
                      setSelectedElements(selectedElements.filter(e => !(e.type === 'trigger' && e.name === trigger.name)));
                    } else {
                      if (selectedElements.filter(e => e.type === 'trigger').length >= 3) {
                        alert('최대 3개까지만 선택할 수 있습니다.');
                        return;
                      }
                      setSelectedElements([...selectedElements, { type: 'trigger', name: trigger.name, IconComponent: trigger.IconComponent }]);
                    }
                  }}
                >
                  <trigger.IconComponent />
                  <span>{trigger.name}</span>
                </TriggerCard>
              ))}
            </TriggerGrid>
          </StepContainer>

          <StepContainer>
            <StepTitle>한문장으로 오늘을 기록해 주세요</StepTitle>
            <MessageInput
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="한문장으로 오늘을 기록해 주세요"
            />
            <ButtonContainer>
              <Button variant="primary" onClick={handleSubmit}>
                작성 완료
              </Button>
              <Button onClick={handleReset}>
                다시하기
              </Button>
            </ButtonContainer>
          </StepContainer>

          {/* 선택한 날짜의 다이어리 내용 표시 */}
          {selectedDay && (
            <StepContainer>
              <StepTitle>선택한 날짜: {selectedDay}</StepTitle>
              {(() => {
                const diary = diaryList.find(d => d.date === selectedDay);
                if (!diary) return <div>이 날짜에는 작성된 다이어리가 없습니다.</div>;
                return (
                  <>
                    <EmotionImagePreview
                      containerColor={diary.emotion?.color || "#f0f0f0"}
                      palette={diary.randomInfo}
                    />
                    <div>감정: {diary.emotion?.name || '-'}</div>
                    <div>메시지: {diary.comment || '-'}</div>
                    <div>
                      트리거: {diary.triggers && diary.triggers.length > 0
                        ? diary.triggers.map((t: any) => t.name).join(', ')
                        : '-'}
                    </div>
                  </>
                );
              })()}
            </StepContainer>
          )}
        </MainContent>

        <PreviewSection isExpanded={isPreviewExpanded}>
          <PreviewContainer isExpanded={isPreviewExpanded}>
            <PreviewTitle isExpanded={isPreviewExpanded}>미리보기</PreviewTitle>
            <EmotionImagePreview
              containerColor={selectedEmotion?.color || "#f0f0f0"}
              palette={randomInfo}
            />
            <ExpandButton onClick={togglePreview}>
              {isPreviewExpanded ? '✕' : '👁️'}
            </ExpandButton>
          </PreviewContainer>
        </PreviewSection>

        <EmotionDiaryCalendar diaryList={diaryList} onDayClick={(date)=> setSelectedDay(date)} />

        {showConfirmModal && (
          <Modal onClick={() => setShowConfirmModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalTitle>작성 완료</ModalTitle>
              <EmotionImagePreview
                containerColor={selectedEmotion?.color || "#f0f0f0"}
                palette={randomInfo}
              />
              <ModalMessage>{message}</ModalMessage>
              <ButtonContainer>
                <Button variant="primary" onClick={handleConfirm}>
                  확인
                </Button>
                <Button onClick={() => setShowConfirmModal(false)}>
                  취소
                </Button>
              </ButtonContainer>
            </ModalContent>
          </Modal>
        )}
      </Container>
      <NavigationBar />
    </>
  );
};

export default EmotionDiary;