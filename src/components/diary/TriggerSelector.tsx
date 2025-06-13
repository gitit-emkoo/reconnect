import React from "react";
import styled from "styled-components";

interface Trigger {
  name: string;
  IconComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface Element {
  type: 'emotion' | 'trigger';
  name: string;
  IconComponent?: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface TriggerSelectorProps {
  triggers: Trigger[];
  selectedElements: Element[];
  setSelectedElements: (elements: Element[]) => void;
}

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
  svg { width: 36px; height: 36px; margin-bottom: 0.5rem; }
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

const TriggerSelector: React.FC<TriggerSelectorProps> = ({ triggers, selectedElements, setSelectedElements }) => {
  const handleTriggerClick = (trigger: Trigger) => {
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
  };

  const handleChipClick = (triggerName: string) => {
    setSelectedElements(selectedElements.filter(e => !(e.type === 'trigger' && e.name === triggerName)));
  };

  return (
    <>
      <SelectedChips>
        {selectedElements.filter(e => e.type === 'trigger').map((trigger) => (
          <Chip key={trigger.name} onClick={() => handleChipClick(trigger.name)}>
            {trigger.name} ✕
          </Chip>
        ))}
      </SelectedChips>
      <TriggerGrid>
        {triggers.map((trigger) => (
          <TriggerCard
            key={trigger.name}
            selected={selectedElements.some(e => e.type === 'trigger' && e.name === trigger.name)}
            onClick={() => handleTriggerClick(trigger)}
          >
            <trigger.IconComponent />
            <span>{trigger.name}</span>
          </TriggerCard>
        ))}
      </TriggerGrid>
    </>
  );
};

export default TriggerSelector; 