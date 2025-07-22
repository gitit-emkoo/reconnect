import React from 'react';
import styled from 'styled-components';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f9fa;
  padding: 1rem;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #333;
  
  &::placeholder {
    color: #999;
  }
`;

const CounselingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CounselingItem = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ItemTopSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  text-align: center;
  flex-shrink: 0;
`;

const ItemHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
`;

const ItemTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ItemWebsite = styled.p`
  font-size: 0.85rem;
  color: #007bff;
  margin: 0;
  text-decoration: underline;
`;

const ContactInfo = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ContactItem = styled.span`
  font-size: 0.75rem;
  color: #888;
  background: #f8f9fa;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
`;

const ItemDescription = styled.p`
  font-size: 0.8rem;
  color: #666;
  line-height: 1.4;
  margin: 0;
`;

const PsychologicalCounseling: React.FC = () => {
  const counselingCenters = [
    {
      id: 1,
      name: '▢▢심리상담담',
      website: 'https://▢▢.co.kr',
      description: '종합심리검사 EVENT · 상담프로그램 · 우울증관리 · 자살예방 · 스트레스관리 · 불면증치료 · PTSD · 심리검사 · 마음명상 · 심리교육 ',
      imageText: '▢▢',
      contact: ['전화', '카톡', '방문']
    },
    {
      id: 2,
      name: '◯◯심리상담센터',
      website: 'https://◯◯.co.kr',
      description: '아동, 청소년, 부부 및 가족상담. 일상에서 스트레스',
      imageText: '◯◯',
      contact: ['전화', '카톡', '네이버톡']
    },
    {
      id: 3,
      name: '◇◇심리상담센터',
      website: 'https://◇◇.co.kr',
      description: '아동뿐만 아니라 청소년, 성인, 부부, 가족 상담도 진행하는 종합 심리상담센터입니다.',
      imageText: '◇◇',
      contact: ['전화', '카톡']
    },
    {
      id: 4,
      name: '△△심리상담소',
      website: 'https://△△.co.kr',
      description: '불안, 공포, 갈등으로 인한 내면의 문제들을 함께 나누어 삶의 의미와 행복한 미래를 찾도록 돕습니다.',
      imageText: '△△',
      contact: ['초기면담', '부부상담', '가족상담']
    },
    {
      id: 5,
      name: '◁◁심리상담센터',
      website: 'https://◁◁.co.kr',
      description: '우울증, 불안장애, 공황장애, 성인/청소년/부부 상담, 중독 치료(도박, 성 중독), 인지행동치료 등',
      imageText: '◁◁',
      contact: ['비대면상담', '전문상담', '화상상담']
    }
  ];

  return (
    <>
    <HeaderSection>
        <Header title="심리상담실" />
        <BackButton />
      </HeaderSection>
    <Container>
      
      

      <SearchBar>
        <SearchInput 
          type="text" 
          placeholder="지역이나 상담 유형을 검색해보세요"
        />
      </SearchBar>

      <CounselingList>
        {counselingCenters.map((center) => (
          <CounselingItem key={center.id}>
            <ItemTopSection>
              <ItemImage>
                {center.imageText}
              </ItemImage>
              <ItemHeader>
                <ItemTitle>{center.name}</ItemTitle>
                <ItemWebsite>{center.website}</ItemWebsite>
                <ContactInfo>
                  {center.contact.map((contact, index) => (
                    <ContactItem key={index}>{contact}</ContactItem>
                  ))}
                </ContactInfo>
              </ItemHeader>
            </ItemTopSection>
            <ItemDescription>{center.description}</ItemDescription>
          </CounselingItem>
        ))}
      </CounselingList>
    </Container>
    </>
  );
};

export default PsychologicalCounseling; 