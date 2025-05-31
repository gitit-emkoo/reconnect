import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import BackButton from "../components/common/BackButton";

// SVG 아이콘 임포트
import TriggerActivitiesIcon from "../assets/Trigger_Activities.svg?react";
import TriggerFamilyIcon from "../assets/Trigger_Family.svg?react";
import TriggerFriendIcon from "../assets/Trigger_Friend.svg?react";
import TriggerHealthIcon from "../assets/Trigger_Health.svg?react";
import TriggerIndependenceIcon from "../assets/Trigger_Independence.svg?react";
import TriggerNewsIcon from "../assets/Trigger_News.svg?react";
import TriggerParticipationIcon from "../assets/Trigger_Participation.svg?react";
import TriggerRelationshipsIcon from "../assets/Trigger_Relationships.svg?react";
import TriggerSelfIcon from "../assets/Trigger_Self.svg?react";
import TriggerWorkIcon from "../assets/Trigger_Work.svg?react";

// 데이터 타입 정의
interface Emotion {
  name: string;
  color: string;
}

interface Trigger {
  name: string;
  IconComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}

type PaletteItem = 
  | { type: 'emotion'; data: Emotion }
  | { type: 'trigger'; data: Trigger };

interface EmotionElement extends Emotion {
  type: 'emotion';
}

interface TriggerElement extends Trigger {
  type: 'trigger';
}

type Element = EmotionElement | TriggerElement;

// 스타일 컴포넌트 정의
const Container = styled.div`
  padding: 2rem;
  background-color: #fefce8;
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
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const StepTitle = styled.h3`
  color: #78350f;
  margin-bottom: 1.5rem;
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

const ElementSelectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
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

const PatternButton = styled.button<{ selected: boolean }>`
  background: ${({ selected }) => (selected ? "#fef3c7" : "#ffffff")};
  border: 2px solid ${({ selected }) => (selected ? "#f59e0b" : "#e5e5e5")};
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  width: 100px;
  height: 100px;
  
  svg {
    width: 40px;
    height: 40px;
    fill: ${({ selected }) => (selected ? "#f59e0b" : "#5a4b40")};
  }

  &:hover {
    background: #fef3c7;
    border-color: #f59e0b;
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
  color: #78350f;
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

const TopBar = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  color: #78350f;
  font-size: 1.5rem;
  margin: 0;
  text-align: center;
  width: 100%;
`;

// 감정 데이터 정의
const emotions: Emotion[] = [
  { name: "Happy", color: "#FFD700" },       // 노랑
  { name: "Excited", color: "#FF6B6B" },     // 밝은 빨강
  { name: "Loved", color: "#FF69B4" },       // 핫핑크
  { name: "Grateful", color: "#FF9EC3" },    // 연한 분홍
  { name: "Hopeful", color: "#DA70D6" },     // 오키드
  { name: "Relaxed", color: "#9370DB" },     // 보라
  { name: "Calm", color: "#6495ED" },        // 콘플라워블루
  { name: "Relieved", color: "#4169E1" },    // 로얄블루
  { name: "Acceptance", color: "#40E0D0" },  // 터콰이즈
  { name: "Satisfied", color: "#98FF98" },   // 민트
  { name: "Angry", color: "#FF4500" },       // 선명한 빨강
  { name: "Stressed", color: "#FF6347" },    // 토마토
  { name: "Anxious", color: "#FFA07A" },     // 연어색
  { name: "Worried", color: "#DEB887" },     // 버블우드
  { name: "Tired", color: "#A0522D" },       // 시에나
  { name: "Sad", color: "#4682B4" },         // 스틸블루
  { name: "Helpless", color: "#5F9EA0" },    // 카데트블루
  { name: "Bored", color: "#708090" },       // 슬레이트그레이
  { name: "Detached", color: "#778899" },    // 라이트슬레이트그레이
  { name: "Restless", color: "#696969" }     // 딤그레이
];

const triggers: Trigger[] = [
  { name: "Activities", IconComponent: TriggerActivitiesIcon },
  { name: "Family", IconComponent: TriggerFamilyIcon },
  { name: "Friend", IconComponent: TriggerFriendIcon },
  { name: "Health", IconComponent: TriggerHealthIcon },
  { name: "Independence", IconComponent: TriggerIndependenceIcon },
  { name: "News", IconComponent: TriggerNewsIcon },
  { name: "Participation", IconComponent: TriggerParticipationIcon },
  { name: "Relationships", IconComponent: TriggerRelationshipsIcon },
  { name: "Self", IconComponent: TriggerSelfIcon },
  { name: "Work", IconComponent: TriggerWorkIcon },
];

// 미리보기 컴포넌트
const EmotionImagePreview: React.FC<{
  containerColor: string;
  palette: PaletteItem[];
}> = ({ containerColor, palette }) => {
  const imageSize = 200;

  const positionedItems = useMemo(() => {
    return palette.map((item, index) => {
      const centerX = imageSize / 2;
      const centerY = imageSize / 2;
      
      // 고정된 각도로 배치 (360도를 요소 개수로 나눔)
      const angle = (index * (2 * Math.PI / palette.length)) + (Math.PI / 4); // 45도 회전해서 시작
      const maxRadius = imageSize * 0.4;
      const radius = maxRadius * 0.8; // 반지름을 좀 더 일정하게
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      const size = imageSize * 0.3; // 크기를 좀 더 일정하게
      
      return {
        ...item,
        x,
        y,
        size,
        rotation: angle * (180 / Math.PI), // 각도에 따라 회전
        shapeType: item.type === 'emotion' ? 'circle' : 'rect',
        opacity: 0.9,
        zIndex: palette.length - index
      };
    });
  }, [palette]);

  return (
    <svg width={imageSize} height={imageSize} viewBox={`0 0 ${imageSize} ${imageSize}`}>
      <defs>
        <clipPath id="circle-clip">
          <circle cx={imageSize / 2} cy={imageSize / 2} r={imageSize / 2} />
        </clipPath>
      </defs>

      <circle cx={imageSize/2} cy={imageSize/2} r={imageSize/2} fill={containerColor} />

      <g clipPath="url(#circle-clip)">
        {positionedItems.map((p, index) => {
          const transform = `translate(${p.x - p.size/2}, ${p.y - p.size/2}) rotate(${p.rotation}, ${p.size/2}, ${p.size/2})`;
          const key = `element-${index}`;

          if (p.type === 'emotion') {
            return (
              <g key={key} transform={transform} style={{ zIndex: p.zIndex }}>
                <circle
                  cx={p.size/2}
                  cy={p.size/2}
                  r={p.size/2}
                  fill={p.data.color}
                  opacity={p.opacity}
                />
              </g>
            );
          } else {
            const Icon = p.data.IconComponent;
            return (
              <g key={key} transform={transform} style={{ zIndex: p.zIndex }}>
                <Icon
                  width={p.size}
                  height={p.size}
                  style={{
                    fill: "#FFFFFF",
                    opacity: 0.9
                  }}
                />
              </g>
            );
          }
        })}
      </g>
    </svg>
  );
};

const convertToPaletteItem = (element: Element): PaletteItem => {
  if (element.type === 'emotion') {
    const { type, ...data } = element;
    return {
      type: 'emotion',
      data
    };
  } else {
    const { type, ...data } = element;
    return {
      type: 'trigger',
      data
    };
  }
};

// 메인 컴포넌트
const EmotionDiary: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleReset = () => {
    setSelectedEmotion(null);
    setSelectedElements([]);
    setMessage("");
  };

  const handleSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    // TODO: 실제 저장 로직 구현
    console.log("저장됨:", {
      emotion: selectedEmotion,
      elements: selectedElements,
      message
    });
    setShowConfirmModal(false);
    handleReset();
  };

  const togglePreview = () => {
    setIsPreviewExpanded(!isPreviewExpanded);
  };

  const allElements: Element[] = [
    ...emotions.map(emotion => ({
      type: 'emotion' as const,
      name: emotion.name,
      color: emotion.color
    })),
    ...triggers.map(trigger => ({
      type: 'trigger' as const,
      name: trigger.name,
      IconComponent: trigger.IconComponent
    }))
  ];

  const handleElementSelect = (element: Element) => {
    if (selectedElements.length >= 5 && !selectedElements.some(e => 
      e.type === element.type && e.name === element.name)) {
      alert('최대 5개까지만 선택할 수 있습니다.');
      return;
    }
    
    setSelectedElements([...selectedElements, element]);
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

  return (
    <>
      <Container>
        <MainContent>
          <TopBar>
            <BackButton onClick={handleBack} />
            <PageTitle>감정 다이어리 작성</PageTitle>
          </TopBar>

          <StepContainer>
            <StepTitle>Step 1: 대표 감정 선택하기</StepTitle>
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
            <StepTitle>Step 2: 감정 요소 선택하기 (최대 5개)</StepTitle>
            <ElementSelectGrid>
              {allElements.map((element, index) => (
                element.type === 'emotion' ? (
                  <EmotionSelectWrapper key={`${element.type}-${element.name}-${index}`}>
                    <ColorDot
                      color={element.color}
                      selected={selectedElements.some(e => 
                        e.type === 'emotion' && e.name === element.name
                      )}
                      onClick={() => handleElementSelect(element)}
                    />
                    <EmotionLabel>{element.name}</EmotionLabel>
                  </EmotionSelectWrapper>
                ) : (
                  <PatternButton
                    key={`${element.type}-${element.name}-${index}`}
                    selected={selectedElements.some(e => 
                      e.type === 'trigger' && e.name === element.name
                    )}
                    onClick={() => handleElementSelect(element)}
                  >
                    <element.IconComponent />
                    <span>{element.name}</span>
                  </PatternButton>
                )
              ))}
            </ElementSelectGrid>
          </StepContainer>

          <StepContainer>
            <StepTitle>Step 3: 메시지 작성하기</StepTitle>
            <MessageInput
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="오늘의 감정에 대해 자유롭게 작성해주세요..."
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
        </MainContent>

        <PreviewSection isExpanded={isPreviewExpanded}>
          <PreviewContainer isExpanded={isPreviewExpanded}>
            <PreviewTitle isExpanded={isPreviewExpanded}>미리보기</PreviewTitle>
            <EmotionImagePreview
              containerColor={selectedEmotion?.color || "#f0f0f0"}
              palette={getPaletteItems()}
            />
            <ExpandButton onClick={togglePreview}>
              {isPreviewExpanded ? '✕' : '👁️'}
            </ExpandButton>
          </PreviewContainer>
        </PreviewSection>

        {showConfirmModal && (
          <Modal onClick={() => setShowConfirmModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalTitle>작성 완료</ModalTitle>
              <EmotionImagePreview
                containerColor={selectedEmotion?.color || "#f0f0f0"}
                palette={getPaletteItems()}
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