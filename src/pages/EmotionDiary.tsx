import React, { useState, useMemo } from "react";
import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import EmotionDiaryCalendar from './EmotionDiaryCalendar';
import Popup from '../components/common/Popup';
import EmotionImagePreview, { generateRandomInfo, PaletteItem } from '../components/EmotionImagePreview';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDiaries, fetchDiaryByDate, createDiary, updateDiary, DiaryEntry } from '../api/diary';
import useAuthStore from '../store/authStore';
import MobileOnlyBanner from '../components/common/MobileOnlyBanner';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { formatInKST } from '../utils/date';
import Header from '../components/common/Header';

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
import { ReactComponent as TriggerTravelIcon } from "../assets/Trigger_Travel.svg";
import { ReactComponent as TriggerShowIcon } from "../assets/Trigger_Show.svg";
import { ReactComponent as TriggerExerciseIcon } from "../assets/Trigger_Exercise.svg";
import { ReactComponent as TriggerStyleIcon } from "../assets/Trigger_Style.svg";
import { ReactComponent as TriggerExamIcon } from "../assets/Trigger_Exam.svg";
import { ReactComponent as TriggerFoodIcon } from "../assets/Trigger_Food.svg";

// 데이터 타입 정의
interface Emotion {
  name: string;
  color: string;
}

interface Trigger {
  name: string;
  IconComponent: React.FC<React.SVGProps<SVGSVGElement>>;
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



const StepContainer = styled.div`
 
  margin-bottom: 2rem;
`;

const StepTitle = styled.h3`
  color:rgb(47, 47, 47);
  font-size: 1rem;
  margin-bottom: 0.8rem;
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

const MessageInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  margin-top: 1rem;
  padding: 1rem;
  border: 2px solid #e5e5e5;
  border-radius: 0.75rem;
  resize: vertical;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #ff69b4;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  background-color: ${({ variant }) => 
    variant === 'primary' ? '#ff69b4' : '#785CD2'};
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
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ModalContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  h2 {
    margin: 0;
    font-size: 1.2rem;
  }
`;

const ModalTitle = styled.h2`
  color:rgb(30, 30, 30);
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ModalMessage = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  width: 100%;
  text-align: center;
  line-height: 1.5;
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
  { name: "무감각함", color: "#DADADA" }, // 회색
  
];

export const triggers = [
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
  // 추가 트리거 (새로운 아이콘)
  { name: "여행", IconComponent: TriggerTravelIcon },
  { name: "공연", IconComponent: TriggerShowIcon },
  { name: "운동", IconComponent: TriggerExerciseIcon },
  { name: "스타일", IconComponent: TriggerStyleIcon },
  { name: "시험", IconComponent: TriggerExamIcon },
  { name: "음식", IconComponent: TriggerFoodIcon },
];

// 트리거 선택 그리드 및 칩 스타일 추가
const TriggerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.7rem;
  margin: 1rem 0;
`;

const TriggerCard = styled.button<{ selected: boolean }>`
  background: ${({ selected }) => (selected ? '#e9d5ff' : '#dadada')};
  border: 2px solid ${({ selected }) => (selected ? '#a78bfa' : '#e0e0e0')};
  border-radius: 0.8rem;
  padding: 0.7rem 0.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: ${({ selected }) => (selected ? '0 2px 8px #a78bfa33' : 'none')};
  transition: all 0.2s;
  cursor: pointer;
  svg {
    width: 28px;
    height: 28px;
    margin-bottom: 0.3rem;
  }
  font-size: 0.95rem;
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
  color:rgb(29, 29, 29);
  border-radius: 1rem;
  padding: 0.3rem 0.8rem;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
`;

// 메인 컴포넌트
const EmotionDiary: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const todayKey = 'emotiondiary_popup';
  const today = formatInKST(new Date(), 'yyyy-MM-dd');
  const ymd = today.replace(/-/g, '');
  const hideToday = typeof window !== 'undefined' && localStorage.getItem(`${todayKey}_${ymd}`) === 'true';
  const [showPopup, setShowPopup] = useState(!hideToday);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [selectedTriggers, setSelectedTriggers] = useState<Trigger[]>([]);
  const [comment, setComment] = useState('');
  const [selectedDateForModal, setSelectedDateForModal] = useState<string | null>(null);
  const [showTriggerLimitModal, setShowTriggerLimitModal] = useState(false);
  const user = useAuthStore((state) => state.user);

  // 다이어리 목록 조회
  const { data: diaryList = [], refetch: refetchDiaries } = useQuery<DiaryEntry[]>({
    queryKey: ['diaries'],
    queryFn: fetchDiaries,
  });

  // 모달에 표시할 다이어리 개별 조회
  const { data: diaryForModal, isLoading: isDiaryForModalLoading } = useQuery({
    queryKey: ['diary', selectedDateForModal],
    queryFn: () => fetchDiaryByDate(selectedDateForModal!),
    enabled: !!selectedDateForModal,
  });

  // 오늘 날짜의 다이어리 조회
  const { data: selectedDiary, refetch: refetchTodayDiary } = useQuery({
    queryKey: ['diary', today],
    queryFn: () => fetchDiaryByDate(today),
    enabled: true
  });

  // 다이어리 생성 mutation
  const createDiaryMutation = useMutation({
    mutationFn: createDiary,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['diaries'] }),
        queryClient.invalidateQueries({ queryKey: ['diary'] }),
        refetchDiaries(),
        refetchTodayDiary()
      ]);
      setShowModal(false);
      setSelectedEmotion(null);
      setSelectedTriggers([]);
      setComment('');
    }
  });

  // 다이어리 수정 mutation
  const updateDiaryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DiaryEntry> }) => updateDiary(id, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['diaries'] }),
        queryClient.invalidateQueries({ queryKey: ['diary'] }),
        refetchDiaries(),
        refetchTodayDiary()
      ]);
      setShowModal(false);
      setSelectedEmotion(null);
      setSelectedTriggers([]);
      setComment('');
    }
  });

  const handleReset = () => {
    setSelectedEmotion(null);
    setSelectedTriggers([]);
    setComment('');
  };

  const handleSubmit = () => {
    setShowModal(true);
  };

  const getPaletteItems = (): PaletteItem[] => {
    const items: PaletteItem[] = [];
    if (selectedEmotion) {
      items.push({ type: 'emotion', data: selectedEmotion });
    }
    items.push(...selectedTriggers.map(trigger => ({ type: 'trigger' as const, data: trigger })));
    return items;
  };

  // 미리보기용 팔레트 및 랜덤 정보 (작성 중에만 사용)
  const previewPalette = useMemo(() => getPaletteItems(), [selectedEmotion, selectedTriggers]);
  const previewRandomInfo = useMemo(() => generateRandomInfo(previewPalette), [previewPalette]);

  // 저장될 실제 randomInfo 생성 (확정된 후에만)
  const savedRandomInfo = useMemo(() => {
    if (selectedEmotion && selectedTriggers.length > 0) {
      const savePalette: PaletteItem[] = getPaletteItems();
      return generateRandomInfo(savePalette);
    }
    return null;
  }, [selectedEmotion, selectedTriggers]);

  const handleConfirm = async () => {
    if (!selectedEmotion || selectedTriggers.length === 0) {
      alert('감정과 트리거를 모두 선택해주세요.');
      return;
    }

    if (!user || !user.id) {
      alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
      return;
    }

    const savePalette: PaletteItem[] = getPaletteItems();
    const saveRandomInfo = savedRandomInfo || generateRandomInfo(savePalette);

    const diaryData = {
      date: today,
      emotion: {
        name: selectedEmotion.name,
        color: selectedEmotion.color
      },
      triggers: selectedTriggers.map(trigger => ({
        name: trigger.name,
        iconComponent: trigger.IconComponent.displayName || trigger.IconComponent.name || trigger.name
      })),
      comment,
      palette: savePalette,
      randomInfo: saveRandomInfo,
      userId: user.id
    };

    try {
      if (selectedDiary?.id) {
        await updateDiaryMutation.mutateAsync({ id: selectedDiary.id, data: diaryData });
      } else {
        await createDiaryMutation.mutateAsync(diaryData);
      }
    } catch (error) {
      console.error('다이어리 저장 실패:', error);
      alert('다이어리 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 트리거 아이콘 매핑 함수 (타입 명확히)
  function mapRandomInfoWithIcons(randomInfo: PaletteItem[]): PaletteItem[] {
    return randomInfo.map((item) => {
      if (item.type === 'trigger') {
        const found = triggers.find(t => t.name === item.data.name);
        return {
          ...item,
          data: {
            ...item.data,
            IconComponent: found ? found.IconComponent : (() => null)
          }
        };
      }
      return item;
    });
  }

  return (
    <>
    <MobileOnlyBanner />
    <Popup
      isOpen={showPopup}
      onClose={() => setShowPopup(false)}
      title="1분 감정다이어리 안내"
      emoji="📔"
      description={<>
        매일매일 작성하는 <b>1분 감정다이어리</b>는<br />
        감정 기록과 전문가에게<br />
        보다 더 정확한 솔루션을 받을 수 있어요.
      </>}
      buttonText="작성 시작하기"
      onButtonClick={() => setShowPopup(false)}
      todayKey="emotiondiary_popup"
    />
    <Header title="감정 다이어리 작성" />
      <Container>
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
              {selectedTriggers.map((trigger) => (
                <Chip key={trigger.name} onClick={() => setSelectedTriggers(selectedTriggers.filter(t => t.name !== trigger.name))}>
                  {trigger.name} ✕
                </Chip>
              ))}
            </SelectedChips>
            {/* 트리거 카드형 그리드 */}
            <TriggerGrid>
              {triggers.map((trigger) => (
                <TriggerCard
                  key={trigger.name}
                  selected={selectedTriggers.some(t => t.name === trigger.name)}
                  onClick={() => {
                    const already = selectedTriggers.some(t => t.name === trigger.name);
                    if (already) {
                      setSelectedTriggers(selectedTriggers.filter(t => t.name !== trigger.name));
                    } else {
                      if (selectedTriggers.length >= 3) {
                        setShowTriggerLimitModal(true);
                        return;
                      }
                      setSelectedTriggers([...selectedTriggers, trigger]);
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
            {/* 미리보기: 코멘트 입력란 위에 배치 */}
            <StepTitle>미리보기</StepTitle>
            <div style={{ width: 100, margin: '0 auto' }}>
              <EmotionImagePreview
                containerColor={selectedEmotion?.color || "#f0f0f0"}
                palette={savedRandomInfo || previewRandomInfo}
                size={100}
              />
            </div>
            
            
            <MessageInput
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="오늘은 어떤 하루를 보내셨나요? 한문장으로 오늘의 감정을 적어주세요."
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

          {/* 선택한 날짜의 다이어리 내용 표시 모달 */}
          {selectedDateForModal && (
            <Modal onClick={() => setSelectedDateForModal(null)}>
              <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalTitle>{formatInKST(new Date(selectedDateForModal), 'yyyy년 M월 d일')} 다이어리</ModalTitle>
                {(() => {
                  if (isDiaryForModalLoading) {
                    return <div>로딩 중...</div>;
                  }
                  const diary = diaryForModal;
                  if (!diary) return <div>이 날짜에는 작성된 다이어리가 없습니다.</div>;

                  return (
                    <>
                      <EmotionImagePreview
                        containerColor={diary.emotion?.color || "#f0f0f0"}
                        palette={diary.randomInfo ? mapRandomInfoWithIcons(diary.randomInfo as PaletteItem[]) : []}
                        size={100}
                      />
                      <div style={{ width: '100%', textAlign: 'left', fontSize: '0.95rem' }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <strong>감정:</strong> {diary.emotion?.name || '-'}
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <strong>메시지:</strong> {diary.comment || '-'}
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <strong>작성 시간:</strong> {diary.createdAt ? formatInKST(diary.createdAt, 'a h:mm') : '-'}
                        </div>
                        <div>
                          <strong>트리거:</strong> {diary.triggers && diary.triggers.length > 0
                            ? diary.triggers.map((t: any) => t.name).join(', ')
                            : '-'}
                        </div>
                      </div>
                      <Button onClick={() => setSelectedDateForModal(null)} style={{ marginTop: '1rem' }}>
                        닫기
                      </Button>
                    </>
                  );
                })()}
              </ModalContent>
            </Modal>
          )}
        </MainContent>

        <EmotionDiaryCalendar diaryList={diaryList} onDayClick={(date) => setSelectedDateForModal(date)} />

        {showModal && (
          <Modal onClick={() => setShowModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalTitle>작성완료 미리보기</ModalTitle>
              <EmotionImagePreview
                containerColor={selectedEmotion?.color || "#f0f0f0"}
                palette={savedRandomInfo || previewRandomInfo}
                size={100}
              />
              <ModalMessage>{comment}</ModalMessage>
              <ButtonContainer>
                <Button variant="primary" onClick={handleConfirm}>
                  확인
                </Button>
                <Button onClick={() => setShowModal(false)}>
                  취소
                </Button>
              </ButtonContainer>
            </ModalContent>
          </Modal>
        )}

        {/* 트리거 제한 모달 */}
        <ConfirmationModal
          isOpen={showTriggerLimitModal}
          onRequestClose={() => setShowTriggerLimitModal(false)}
          onConfirm={() => setShowTriggerLimitModal(false)}
          title=""
          message="트리거는 3개 이상 사용할 수 없습니다"
          confirmButtonText="확인"
          showCancelButton={false}
        />
      </Container>
      <NavigationBar />
    </>
  );
};

export default EmotionDiary;