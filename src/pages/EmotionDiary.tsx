import React, { useState, useMemo } from "react";
import styled from "styled-components";

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

type EmotionElement = {
  type: 'emotion';
  name: string;
  color: string;
};

type TriggerElement = {
  type: 'trigger';
  name: string;
  IconComponent: React.FC<React.SVGProps<SVGSVGElement>>;
};

type Element = EmotionElement | TriggerElement;

// 스타일 컴포넌트 정의
const Container = styled.div`
  padding: 2rem;
  background-color: #fefce8;
  min-height: 100vh;
  max-width: 800px;
  margin: 0 auto;
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
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
`;

const EmotionLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
  text-align: center;
`;

const ColorDot = styled.button<{ color: string; selected: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  border: 3px solid ${({ selected }) => selected ? '#000' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
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

const PreviewContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border: 2px dashed #e5e5e5;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  svg {
    max-width: 200px;
    height: auto;
  }
`;

const ResetButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;

  &:hover {
    background-color: #dc2626;
  }
`;

// 감정 데이터 정의
const emotions: Emotion[] = [
  { name: "Acceptance", color: "#FF7F50" },  // 코랄
  { name: "Calm", color: "#87CEEB" },        // 하늘색
  { name: "Excited", color: "#FF69B4" },     // 핫핑크
  { name: "Grateful", color: "#FF9EC3" },    // 연한 분홍
  { name: "Happy", color: "#FFD700" },       // 골드
  { name: "Hopeful", color: "#8A2BE2" },     // 블루바이올렛
  { name: "Loved", color: "#FFB6C1" },       // 라이트핑크
  { name: "Relaxed", color: "#98FF98" },     // 민트
  { name: "Relieved", color: "#4169E1" },    // 로얄블루
  { name: "Satisfied", color: "#FFA500" },    // 오렌지
  { name: "Angry", color: "#8B4513" },       // 새들브라운
  { name: "Anxious", color: "#778899" },     // 라이트슬레이트그레이
  { name: "Bored", color: "#000080" },       // 네이비
  { name: "Detached", color: "#E6E6FA" },    // 라벤더
  { name: "Helpless", color: "#87CEEB" },    // 스카이블루
  { name: "Restless", color: "#98FB98" },    // 페일그린
  { name: "Sad", color: "#191970" },         // 미드나잇블루
  { name: "Stressed", color: "#800080" },    // 퍼플
  { name: "Tired", color: "#40E0D0" },       // 터콰이즈
  { name: "Worried", color: "#FFB6C1" }      // 라이트핑크
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
    const itemsToShow = palette.slice(-5);
    
    return itemsToShow.map((item, index) => {
      const centerX = imageSize / 2;
      const centerY = imageSize / 2;
      
      // 바깥쪽에서 안쪽으로 쌓이도록 반지름 조정
      const maxRadius = imageSize * 0.45;
      const radius = maxRadius * (1 - index / itemsToShow.length * 0.5);
      const angle = (index * (Math.PI * 0.5)) + Math.random() * (Math.PI * 0.5);
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      const size = imageSize * (0.4 - index * 0.05);
      const rotation = Math.random() * 360;
      
      const shapeType = ['circle', 'rect'][Math.floor(Math.random() * 2)];
      const shouldIncludeIcon = item.type === 'emotion' && Math.random() > 0.5;
      const randomTrigger = triggers[Math.floor(Math.random() * triggers.length)];
      
      return {
        ...item,
        x,
        y,
        size,
        rotation,
        shapeType,
        opacity: 0.9,
        zIndex: itemsToShow.length - index,
        shouldIncludeIcon,
        iconScale: 0.7,
        randomTrigger
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
          const transform = `translate(${p.x}, ${p.y}) rotate(${p.rotation})`;
          const key = `element-${index}`;

          if (p.type === 'emotion') {
            const shape = (
              <g key={key} style={{ zIndex: p.zIndex }}>
                {p.shapeType === 'circle' ? (
                  <circle
                    transform={transform}
                    r={p.size / 2}
                    fill={p.data.color}
                    opacity={p.opacity}
                  />
                ) : (
                  <rect
                    transform={transform}
                    width={p.size}
                    height={p.size * 0.6}
                    fill={p.data.color}
                    opacity={p.opacity}
                  />
                )}
                {p.shouldIncludeIcon && (
                  <g transform={transform}>
                    <p.randomTrigger.IconComponent
                      width={p.size * p.iconScale}
                      height={p.size * p.iconScale}
                      style={{
                        fill: "#FFFFFF",
                        opacity: 0.9
                      }}
                    />
                  </g>
                )}
              </g>
            );
            return shape;
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

// 메인 컴포넌트
const EmotionDiary: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);

  const handleReset = () => {
    setSelectedEmotion(null);
    setSelectedElements([]);
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

  return (
    <Container>
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

      {(selectedEmotion || selectedElements.length > 0) && (
        <PreviewContainer>
          <h3>미리보기</h3>
          <EmotionImagePreview
            containerColor={selectedEmotion?.color || "#f0f0f0"}
            palette={[
              ...(selectedEmotion ? [{ type: 'emotion' as const, data: selectedEmotion }] : []),
              ...selectedElements.map(element => {
                if (element.type === 'emotion') {
                  return {
                    type: 'emotion' as const,
                    data: { name: element.name, color: element.color }
                  };
                } else {
                  return {
                    type: 'trigger' as const,
                    data: {
                      name: element.name,
                      IconComponent: element.IconComponent
                    }
                  };
                }
              })
            ]}
          />
          <ResetButton onClick={handleReset}>다시하기</ResetButton>
        </PreviewContainer>
      )}
    </Container>
  );
};

export default EmotionDiary;