import React, { useState } from "react";
import styled from "styled-components";
import OriginalCalendar, { type CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { DiaryEntry } from '../../api/diary';
import { formatInKST } from '../../utils/date';

// 캘린더 컴포넌트를 styled-components로 래핑합니다.
const StyledCalendar = styled(OriginalCalendar)`
  width: 100%;
  border: none;
  border-radius: 0.5rem;
  font-family: 'Pretendard', sans-serif;
  padding: 1rem;
  background-color: #f9f9f9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  // 네비게이션 (월 이동)
  .react-calendar__navigation {
    display: flex;
    height: 44px;
    margin-bottom: 1em;
  }
  .react-calendar__navigation button {
    color: #E64A8D;
    min-width: 44px;
    background: none;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 0.25rem;
    &:hover {
      background-color: #f0f0f0;
    }
  }

  // 요일 표시
  .react-calendar__month-view__weekdays__weekday {
    text-align: center;
    padding: 0.5em;
    text-decoration: none;
    color: #555;
    font-weight: bold;
    font-size: 0.85rem;
    abbr {
      text-decoration: none;
    }
  }

  // 날짜 타일
  .react-calendar__tile {
    max-width: 100%;
    padding: 0;
    background: none;
    text-align: center;
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    font-size: 0.9rem;
    border: none;
    border-radius: 0.25rem;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #f0f0f0;
  }
  .react-calendar__tile--now { // 오늘 날짜
    background: #fff0f5;
    font-weight: bold;
  }
  .react-calendar__tile--active { // 선택된 날짜
    background: #E64A8D;
    color: white;
    font-weight: bold;
  }
`;



const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  min-width: 280px;
  max-width: 340px;
  box-shadow: 0 4px 16px #0001;
`;

const ModalTitle = styled.h3`
  margin: 0;
  margin-bottom: 16px;
  font-size: 18px;
  color: #E64A8D;
`;

const ModalInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;

  span {
    font-size: 16px;
  }
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: #E64A8D;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;

  &:hover {
    background: #d13d7d;
  }
`;

type CalendarValue = Date | null | [Date | null, Date | null];

// DiaryStatus 타입 정의 (Dashboard.tsx와 동일하게)
interface DiaryStatus {
  hasEmotionDiary: boolean;
  hasSentEmotionCard: boolean;
  hasReceivedEmotionCard: boolean;
}

interface DashboardCalendarProps {
  diaryList: DiaryEntry[];
  StatusIcons: React.FC<DiaryStatus>;
  sentMessages: any[];
  receivedMessages: any[];
  userId: string;
  scheduleMap: { [date: string]: string[] };
  onDeleteSchedule: (date: string, idx: number) => void;
  onDateClick: (date: string) => void;
}

const DashboardCalendar = ({ 
  diaryList = [], 
  StatusIcons,
  sentMessages = [],
  receivedMessages = [],
  userId,
  scheduleMap,
  onDeleteSchedule,
  onDateClick
}: DashboardCalendarProps) => {
  const [calendarDate, setCalendarDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 감정카드 데이터 props로 전달받도록 수정 필요 (또는 useQuery 사용)
  // tileContent에서 날짜별 상태 계산
  const getDiaryStatus = (dateString: string): DiaryStatus => ({
    hasEmotionDiary: diaryList.some(d => d.date === dateString),
    hasSentEmotionCard: sentMessages.some((msg: any) => msg.senderId === userId && formatInKST(msg.createdAt, 'yyyy-MM-dd') === dateString),
    hasReceivedEmotionCard: receivedMessages.some((msg: any) => msg.receiverId === userId && formatInKST(msg.createdAt, 'yyyy-MM-dd') === dateString),
  });

  const tileContent: CalendarProps['tileContent'] = ({ date, view }) => {
    if (view === 'month') {
      const dateString = formatDate(date);
      const status = getDiaryStatus(dateString);
      const hasSchedule = scheduleMap[dateString] && scheduleMap[dateString].length > 0;
      return (
        <>
          <StatusIcons {...status} />
          {hasSchedule && <div style={{ marginTop: 2, fontSize: 18 }}>✔️</div>}
        </>
      );
    }
    return null;
  };

  const handleCalendarChange: CalendarProps['onChange'] = (
    value: CalendarValue, 
    _event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (value instanceof Date) {
      setCalendarDate(value);
    } else if (Array.isArray(value)) { 
      if (value[0] instanceof Date) {
        setCalendarDate(value[0]); 
      }
    }
  };

  const handleDayClick: CalendarProps['onClickDay'] = (value: Date, _event: React.MouseEvent<HTMLButtonElement>) => {
    const dateStr = formatDate(value);
    setSelectedDate(dateStr);
    setIsDateModalOpen(true);
    if (onDateClick) onDateClick(dateStr);
  };

  // 날짜별 활동 내역(감정일기/카드) + 일정 모달
  const getDateActivities = (dateString: string) => {
    const activities = [];
    // 감정일기 확인
    if (diaryList.find(d => d.date === dateString)) {
      activities.push({ type: 'diary', icon: '📔', text: '감정일기를 작성했어요.' });
    }
    // 보낸 감정카드 확인
    const sentCard = sentMessages.find((msg: any) => 
      msg.senderId === userId && formatInKST(msg.createdAt, 'yyyy-MM-dd') === dateString
    );
    if (sentCard) {
      activities.push({ 
        type: 'sentCard', 
        icon: '💌', 
        text: `파트너에게 감정카드를 보냈어요.${sentCard.emoji ? ` (${sentCard.emoji})` : ''}` 
      });
    }
    // 받은 감정카드 확인
    const receivedCard = receivedMessages.find((msg: any) => 
      msg.receiverId === userId && formatInKST(msg.createdAt, 'yyyy-MM-dd') === dateString
    );
    if (receivedCard) {
      activities.push({ 
        type: 'receivedCard', 
        icon: '💝', 
        text: `파트너로부터 감정카드를 받았어요.${receivedCard.emoji ? ` (${receivedCard.emoji})` : ''}` 
      });
    }
    return activities;
  };

  const renderDateModal = () => (
    isDateModalOpen && selectedDate && (
      <ModalBackdrop onClick={() => setIsDateModalOpen(false)}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <ModalTitle>{selectedDate} 활동 & 일정</ModalTitle>
          {/* 활동 내역 */}
          {(() => {
            const activities = getDateActivities(selectedDate);
            if (activities.length === 0) {
              return <div style={{ color: '#aaa', fontSize: 15, textAlign: 'center', margin: '12px 0' }}>감정일기/카드 활동이 없습니다</div>;
            }
            return activities.map((activity, index) => (
              <ModalInfoItem key={index}>
                <span>{activity.icon}</span>
                {activity.text}
              </ModalInfoItem>
            ));
          })()}
          {/* 일정 리스트 */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: '#7D5FFF' }}>일정</div>
            {(scheduleMap[selectedDate] && scheduleMap[selectedDate].length > 0) ? (
              scheduleMap[selectedDate].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', borderRadius: 6, padding: '6px 10px', marginBottom: 6 }}>
                  <span style={{ fontSize: 15 }}>{item}</span>
                  <span style={{ cursor: 'pointer', marginLeft: 8 }} onClick={() => onDeleteSchedule(selectedDate, idx)}>🗑️</span>
                </div>
              ))
            ) : (
              <div style={{ color: '#aaa', fontSize: 15, textAlign: 'center', margin: '8px 0' }}>일정이 없습니다</div>
            )}
          </div>
          <CloseButton onClick={() => setIsDateModalOpen(false)}>닫기</CloseButton>
        </ModalContent>
      </ModalBackdrop>
    )
  );

  return (
    <>
      <StyledCalendar
        value={calendarDate}
        onChange={handleCalendarChange}
        tileContent={tileContent}
        onClickDay={handleDayClick}
      />
      {renderDateModal()}
    </>
  );
};

export default DashboardCalendar;

// styled components를 export하도록 수정
export const StatusDot = styled.span<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  display: inline-block;
`;

export const ToggleIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`; 