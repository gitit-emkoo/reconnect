import React from 'react';
import styled from 'styled-components';

export interface Tab {
  key: string;
  label: React.ReactNode;
  badge?: React.ReactNode;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin: 2.5rem 0 0.5rem 0;
  gap: 2.2rem;
  position: relative;
  border-bottom: 2px solid #ececec;
  overflow: visible;
`;

const TabButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  outline: none;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ active }) => (active ? '#7C3AED' : '#888')};
  padding: 0.5rem 0.7rem 0.7rem 0.7rem;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  margin-bottom: -2px;

  &::after {
    content: '';
    display: ${({ active }) => (active ? 'block' : 'none')};
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background: #7C3AED;
    border-radius: 2px 2px 0 0;
    z-index: 2;
  }
`;

const Badge = styled.span`
  background: #FF4D4F;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 0.6rem;
  padding: 0.1rem 0.6rem;
  margin-left: 0.5rem;
  vertical-align: middle;
`;

const TabSwitcher: React.FC<TabSwitcherProps> = ({ tabs, activeKey, onChange, style, className }) => {
  return (
    <TabContainer style={style} className={className}>
      {tabs.map(tab => (
        <TabButton
          key={tab.key}
          active={activeKey === tab.key}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
          {tab.badge && <Badge>{tab.badge}</Badge>}
        </TabButton>
      ))}
    </TabContainer>
  );
};

export default TabSwitcher; 