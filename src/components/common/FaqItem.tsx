import React, { useState } from 'react';
import styled from 'styled-components';

const ItemContainer = styled.div`
  border-bottom: 1px solid #eee;
`;

const QuestionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.5rem;
  cursor: pointer;
  user-select: none;
`;

const QuestionText = styled.p`
  font-size: 0.95rem;
  color: #333;
  margin: 0;
`;

const AnswerWrapper = styled.div<{ isOpen: boolean }>`
  padding: 0 0.5rem 1rem 0.5rem;
  font-size: 0.85rem;
  color: #555;
  line-height: 1.6;
  background-color: #f9f9f9;
  border-top: 1px solid #eee; 
  display: ${props => (props.isOpen ? 'block' : 'none')};

  p {
    margin: 0;
    padding-top: 0.5rem;
  }
`;

const ArrowIcon = styled.span<{ isOpen: boolean }>`
  font-size: 1rem;
  color: #777;
  transition: transform 0.2s ease-in-out;
  margin-left: 0.5rem;

  &::before {
    content: '${props => (props.isOpen ? '▾' : '▸')}';
    display: inline-block;
  }
`;

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ItemContainer>
      <QuestionWrapper onClick={toggleOpen}>
        <QuestionText>{question}</QuestionText>
        <ArrowIcon isOpen={isOpen} />
      </QuestionWrapper>
      <AnswerWrapper isOpen={isOpen}>
        <p>{answer}</p>
      </AnswerWrapper>
    </ItemContainer>
  );
};

export default FaqItem; 