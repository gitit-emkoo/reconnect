import React, { useState } from 'react';
import EmotionImagePreview, { PaletteItem } from '../components/EmotionImagePreview';
import { triggers } from './EmotionDiary';
import { toKST } from '../utils/date';
import { ReactComponent as DirectionLeftActive } from '../assets/DirectionLeftActive.svg';
import { ReactComponent as DirectionRightActive } from '../assets/DirectionRightActive.svg';


interface DiaryEntry {
  date: string;
  emotion: {
    name: string;
    color: string;
  };
  triggers: any[];
  comment: string;
  randomInfo: any[];
}

interface Props {
  diaryList: DiaryEntry[];
  onDayClick: (date: string) => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
];

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

const EmotionDiaryCalendar: React.FC<Props> = ({ diaryList, onDayClick }) => {
  // 월/년 상태 관리
  const now = toKST(new Date());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth()); // 0-indexed

  // 월 이동 핸들러
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };
  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
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
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 18, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }} aria-label="이전 달">
          <DirectionLeftActive width={24} height={24} />
        </button>
        {MONTHS[currentMonth]} {currentYear}
        <button onClick={handleNextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }} aria-label="다음 달">
          <DirectionRightActive width={24} height={24} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
        {WEEKDAYS.map((w) => (
          <div key={w} style={{ textAlign: 'center', color: '#888', fontSize: 13 }}>{w}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const entry = diaryList.find(d => d.date === dateStr);
          return (
            <div key={dateStr + '-' + idx} style={{ textAlign: 'center', cursor: entry ? 'pointer' : 'default' }}
              onClick={() => entry && onDayClick(dateStr)}>
              {entry && entry.randomInfo ? (
                <div style={{ width: 36, height: 36, margin: '0 auto' }}>
                  <EmotionImagePreview
                    containerColor={entry.emotion?.color || "#f0f0f0"}
                    palette={mapRandomInfoWithIcons(entry.randomInfo as PaletteItem[])}
                    size={36}
                  />
                </div>
              ) : entry ? (
                <div style={{ width: 36, height: 36, margin: '0 auto' }}>
                  <EmotionImagePreview
                    containerColor={entry.emotion?.color || "#f0f0f0"}
                    palette={[
                      { type: 'emotion', data: entry.emotion },
                      ...entry.triggers.map((trigger: any) => ({
                        type: 'trigger',
                        data: {
                          name: trigger.name,
                          IconComponent: triggers.find(t => t.name === trigger.name)?.IconComponent || (() => null)
                        }
                      }))
                    ]}
                    size={36}
                  />
                </div>
              ) : (
                <svg width={36} height={36}>
                  <circle cx={18} cy={18} r={18} fill="#eee" />
                </svg>
              )}
              <div style={{ fontSize: 11, marginTop: 2, color: '#888' }}>{day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionDiaryCalendar; 