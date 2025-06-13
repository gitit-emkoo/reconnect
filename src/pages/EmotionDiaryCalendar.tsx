import React from 'react';
import { RandomArtCircle } from './EmotionDiary';

interface DiaryEntry {
  date: string;
  emotion: any;
  triggers: any[];
  comment: string;
}

interface Props {
  diaryList: DiaryEntry[];
  onDayClick: (date: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const EmotionDiaryCalendar: React.FC<Props> = ({ diaryList, onDayClick }) => {
  // 이번 달 정보
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();

  // 달력 셀 배열 생성
  const cells = [];
  for (let i = 0; i < startWeekday; i++) {
    cells.push(null); // 빈 칸
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return (
    <div style={{ margin: '2rem 0' }}>
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
        {MONTHS[month]} {year}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
        {WEEKDAYS.map((w) => (
          <div key={w} style={{ textAlign: 'center', color: '#888', fontSize: 13 }}>{w}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const entry = diaryList.find(d => d.date === dateStr);
          return (
            <div key={day} style={{ textAlign: 'center', cursor: entry ? 'pointer' : 'default' }}
              onClick={() => entry && onDayClick(dateStr)}>
              {entry
                ? <RandomArtCircle size={36} shapeCount={4} />
                : <svg width={36} height={36}><circle cx={18} cy={18} r={18} fill="#eee" /></svg>
              }
              <div style={{ fontSize: 11, marginTop: 2, color: '#888' }}>{day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionDiaryCalendar; 