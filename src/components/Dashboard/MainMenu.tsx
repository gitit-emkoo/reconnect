import React from 'react';
import styled from 'styled-components';
import iconDiary from '../../assets/diary2.png';
import iconCard from '../../assets/card2.png';
import iconChallenge from '../../assets/challenge2.png';
import iconReport from '../../assets/report2.png';
import ImgAgreement2 from '../../assets/img_agreement2.png';

const MainMenuRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  justify-content: center;
  margin: 2.5rem 0;
`;

const MainMenuItem = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const MainMenuIcon = styled.img`
  width: 40px;
  height: 40px;
  margin-bottom: 6px;
`;

const MainMenuText = styled.span`
  font-weight: 500;
  font-size: 13px;
  color: #666;
  text-align: center;
`;

interface MainMenuProps {
  onFeatureClick: (path: string, requiresPartner?: boolean) => void;
  hasPartner: boolean;
}

const MainMenu: React.FC<MainMenuProps> = ({ onFeatureClick, hasPartner }) => (
  <MainMenuRow>
    <MainMenuItem onClick={() => onFeatureClick('/emotion-diary')}>
        <MainMenuIcon src={iconDiary} alt="감정일기 아이콘" />
        <MainMenuText>감정일기</MainMenuText>
    </MainMenuItem>
    <MainMenuItem disabled={!hasPartner} onClick={() => onFeatureClick('/emotion-card', true)}>
        <MainMenuIcon src={iconCard} alt="감정카드 아이콘" />
        <MainMenuText>감정카드</MainMenuText>
    </MainMenuItem>
    <MainMenuItem disabled={!hasPartner} onClick={() => onFeatureClick('/agreement', true)}>
        <MainMenuIcon src={ImgAgreement2} alt="합의서 아이콘" />
        <MainMenuText>합의서</MainMenuText>
    </MainMenuItem>
    <MainMenuItem disabled={!hasPartner} onClick={() => onFeatureClick('/challenge', true)}>
        <MainMenuIcon src={iconChallenge} alt="챌린지 아이콘" />
        <MainMenuText>챌린지</MainMenuText>
    </MainMenuItem>
    <MainMenuItem onClick={() => onFeatureClick('/report')}>
        <MainMenuIcon src={iconReport} alt="리포트 아이콘" />
        <MainMenuText>리포트</MainMenuText>
    </MainMenuItem>
  </MainMenuRow>
);

export default MainMenu;