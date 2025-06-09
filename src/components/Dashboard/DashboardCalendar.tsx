import React, { useState, useEffect } from "react";
import styled from "styled-components";
import OriginalCalendar, { type CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3px; 
  min-height: 8px; 
`;

const Dot = styled.span<{ color: string }>`
  height: 7px; 
  width: 7px;  
  background-color: ${props => props.color};
  border-radius: 50%;
  display: inline-block;
  margin: 0 1.5px; 
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
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  min-width: 300px;
  max-width: 90%;
  text-align: left; 
`;

const ModalTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ModalInfoItem = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  span {
    margin-right: 8px; 
  }
`;

const CloseButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.6rem 1.2rem;
  background-color: #E64A8D;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  display: block; 
  margin-left: auto;
  margin-right: auto;
  &:hover {
    background-color: #c33764;
  }
`;

// Interface (Dashboard.tsx에서 이동)
interface EventData {
  date: string; 
  isAnniversary?: boolean;
  anniversaryName?: string;
  hasEmotionDiary?: boolean;
  hasSentEmotionCard?: boolean; 
  hasReceivedEmotionCard?: boolean; 
}

// Dummy Data (Dashboard.tsx에서 이동)
const dummyEvents: EventData[] = [
  { date: '2024-07-05', isAnniversary: true, anniversaryName: '첫 만남 ❤️' },
  { date: '2024-07-10', hasEmotionDiary: true, hasSentEmotionCard: true },
  { date: '2024-07-12', hasReceivedEmotionCard: true },
  { date: '2024-07-15', hasSentEmotionCard: true, hasReceivedEmotionCard: true },
  { date: '2024-07-20', hasEmotionDiary: true, hasReceivedEmotionCard: true },
  { date: '2024-07-22', isAnniversary: true, anniversaryName: '결혼 기념일 💍', hasEmotionDiary: true, hasSentEmotionCard: true },
];

type CalendarValue = Date | null | [Date | null, Date | null];

const DashboardCalendar: React.FC = () => {
  const [calendarDate, setCalendarDate] = useState(new Date()); 
  const [selectedDateData, setSelectedDateData] = useState<any | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [monthlyEvents, setMonthlyEvents] = useState<any[]>([]);

  useEffect(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth() + 1;
    const filteredEvents = (dummyEvents || []).filter((event: any) => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() + 1 === month;
    });
    setMonthlyEvents(filteredEvents);
  }, [calendarDate]);
  
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const tileContent: CalendarProps['tileContent'] = ({ date, view }) => {
    if (view === 'month') {
      const dateString = formatDate(date);
      const dayEvent = monthlyEvents.find(event => event.date === dateString);
      if (dayEvent) {
        return (
          <DotsContainer>
            {dayEvent.isAnniversary && <Dot color="#8A2BE2" />} 
            {dayEvent.hasEmotionDiary && <Dot color="#FF69B4" />} 
            {dayEvent.hasSentEmotionCard && <Dot color="#FFA500" />} 
            {dayEvent.hasReceivedEmotionCard && <Dot color="#32CD32" />} 
          </DotsContainer>
        );
      }
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
    const dateString = formatDate(value);
    const eventData = monthlyEvents.find(event => event.date === dateString);
    setSelectedDateData(eventData ? eventData : { date: dateString });
    setIsDateModalOpen(true);
  };
  
  const handleMonthChange: CalendarProps['onActiveStartDateChange'] = (props: any) => {
    if (props.activeStartDate instanceof Date) {
      setCalendarDate(props.activeStartDate);
    }
  };

  return (
    <>
      <StyledCalendar
        onChange={handleCalendarChange}
        value={calendarDate}
        onActiveStartDateChange={handleMonthChange}
        tileContent={tileContent}
        onClickDay={handleDayClick}
        formatDay={(_locale, date) => date.getDate().toString()}
        locale="ko-KR"
      />
      
      {isDateModalOpen && (
        <ModalBackdrop onClick={() => setIsDateModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{selectedDateData.date}</ModalTitle>
            {selectedDateData.isAnniversary && <ModalInfoItem><span>💍</span> {selectedDateData.anniversaryName}</ModalInfoItem>}
            {selectedDateData.hasEmotionDiary && <ModalInfoItem><span>📔</span> 감정일기를 작성했어요.</ModalInfoItem>}
            {selectedDateData.hasSentEmotionCard && <ModalInfoItem><span>💌</span> 감정카드를 보냈어요.</ModalInfoItem>}
            {selectedDateData.hasReceivedEmotionCard && <ModalInfoItem><span>📨</span> 감정카드를 받았어요.</ModalInfoItem>}
            {!selectedDateData.isAnniversary && !selectedDateData.hasEmotionDiary && !selectedDateData.hasSentEmotionCard && !selectedDateData.hasReceivedEmotionCard && <p>이벤트가 없습니다.</p>}
            <CloseButton onClick={() => setIsDateModalOpen(false)}>닫기</CloseButton>
          </ModalContent>
        </ModalBackdrop>
      )}
    </>
  );
};

export default DashboardCalendar; 