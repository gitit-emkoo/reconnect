import React from 'react';
import styled from 'styled-components';

interface TemperatureDescriptionProps {
  score: number;
  reason: string;
}

const temperatureLevels = [
  { min: 96, max: 100, title: '완전 연결', description: '마침내 서로의 마음이 완벽히 연결되어 있어요. 이 온도는 이제부터 오래도록 지키는게 중요해요.' },
  { min: 91, max: 95, title: '뜨거운 공감', description: '공감이 깊어지는 온도까지 왔습니다. 오늘도 서로의 이야기에 귀 기울여 주세요 완벽한 정서적 연결을 향해 갑니다.' },
  { min: 86, max: 90, title: '거의 이상적', description: '매우 이상적인 온도입니다 이때부터가 너무 중요해요 이제부터 우리를 더 뜨겁게 만들어 갈 수 있어요 뜨거운 공감까지 가볼까요?' },
  { min: 81, max: 85, title: '깊은 이해', description: '이제 서로를 이해하고 공감하는 깊은 관계가 시작되었어요 작은 차이도 존중해 주며 우리의 온도를 더욱 높여가 보세요' },
  { min: 76, max: 80, title: '안정적인 유대', description: '안정적인 유대감으로 우리의 관계를 따뜻하게 지켜주는 온도 입니다. 함께하는 루틴을 만들어 우리의 거리를 조금 더 좁혀 보아요' },
  { min: 71, max: 75, title: '배려가 시작되는', description: '상호 배려가 시작되며 따뜻해지는 온도까지 왔습니다. 노력한 상대를 위해 작은 선물을 해보세요.' },
  { min: 66, max: 70, title: '일상적인 연결', description: '일상의 대화와 스킨십이 온도를 올려요. 자연스러운 관심이 사랑의 온도 유지 비결입니다.' },
  { min: 61, max: 65, title: '조용한 동행', description: '평균 온도를 넘게 되었어요 말없이 함께하는 시간도 소중하지만 감정카드로 더 많은 감정을 나누는 것이 필요해요' },
  { min: 56, max: 60, title: '무심한 평온', description: '평균보다 조금 낮지만 관계를 뜨겁게 하기위한 골든타임인만큼 우리의 관계에 더욱 집중 해 보세요' },
  { min: 51, max: 55, title: '미묘한 거리감', description: '미묘한 어색함이 느껴지나요? 아직 늦지 않았습니다. 얼마든지 우리 관계를 회복할 수 있어요 점점 올라가는 온도처럼 우리의 거리도 줄어들테니 걱정 말아요' },
  { min: 46, max: 50, title: '어색한 거리감', description: '서로 조금 멀게 느껴진다면 함께했던 좋은 순간을 떠올리며 다시 다가가 보세요. 커플 챌린지가 필요한 시기 입니다.' },
  { min: 41, max: 45, title: '차가움이 시작하는', description: '차가움이 스며들기 전에, 서로 솔직한 대화로 서로의 마음을 데워보세요. 먼저 말 거는 사람이 용기 있는 사람이에요.' },
  { min: 36, max: 40, title: '감정적 단절', description: '감정의 끈이 약해지고 있어요. 서로 노력하는것도 중요하지만 전문가의 도움을 받아 보는 것도 중요합니다. 우리의 목표는 관계를 회복하는 것이니까요…' },
  { min: 0, max: 35, title: '❄️ 정서적 냉각기', description: '지금은 냉각기일 수 있어요. 하지만 모든 관계는 회복될 수 있다는 걸 기억하세요—작은 메시지 하나가 시작입니다.' }
];

const DescriptionContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #f1f5f9;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
`;

const Reason = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  line-height: 1.5;
`;

const TemperatureDescription: React.FC<TemperatureDescriptionProps> = ({ score, reason }) => {
  const level = temperatureLevels.find(l => score >= l.min && score <= l.max);

  if (!level) {
    return null;
  }

  return (
    <DescriptionContainer>
      <Title>{level.title}</Title>
      <Description>{level.description}</Description>
      {reason && reason !== "지난 주와 큰 변화가 없었어요." && (
        <Reason>💡 {reason}</Reason>
      )}
    </DescriptionContainer>
  );
};

export default TemperatureDescription; 