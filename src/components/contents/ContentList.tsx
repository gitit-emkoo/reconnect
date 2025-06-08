import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { mockContents } from '../../mocks/mockContents';
import { ContentCard } from './ContentCard';

interface ContentListProps {
  onCardClick: (id: string) => void;
}

const ROWS = 5;

export const ContentList: React.FC<ContentListProps> = ({ onCardClick }) => {
  // 줄별로 콘텐츠 분할
  const rows = Array.from({ length: ROWS }, (_, i) =>
    mockContents.filter((_, idx) => idx % ROWS === i)
  );

  return (
    <div>
      <h3>AI가 추천하는 콘텐츠</h3>
      <div className="content-list">
        {rows.map((row, i) => (
          <Swiper
            key={i}
            slidesPerView={4}
            spaceBetween={20}
            loop
            speed={20000}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            dir={i % 2 === 0 ? 'ltr' : 'rtl'}
            style={{ marginBottom: 32 }}
          >
            {row.map((item, idx) => (
              <SwiperSlide key={item.id} style={{ minWidth: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ContentCard {...item} index={i * row.length + idx} onClick={() => onCardClick(item.id)} />
              </SwiperSlide>
            ))}
          </Swiper>
        ))}
      </div>
    </div>
  );
}; 