import React from "react";
import styled from "styled-components";

interface Emotion {
  name: string;
  color: string;
}

interface EmotionSelectorProps {
  emotions: Emotion[];
  selectedEmotion: Emotion | null;
  setSelectedEmotion: (emotion: Emotion) => void;
}

const SelectionGrid = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  margin: 1rem 0;
  padding: 0.5rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
  &::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
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
  &:hover { transform: scale(1.1); }
`;

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ emotions, selectedEmotion, setSelectedEmotion }) => (
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
);

export default EmotionSelector; 