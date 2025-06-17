import React, { useMemo, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules'; // Autoplay 모듈 임포트
import 'swiper/css';
import 'swiper/css/autoplay';
import { ContentCard }  from './ContentCard';
import type { Content }  from '../../types/content';

const ROWS = 5;

interface ContentListProps {
  contents: Content[];
  onCardClick: (id: string) => void;
}

const MemoizedSwiper = React.memo(({ 
  row, 
  index, 
  onCardClick 
}: { 
  row: Content[], 
  index: number,
  onCardClick: (id: string) => void 
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 카드를 3번 반복해서 연속 효과 생성
  const duplicatedRow = [...row, ...row, ...row];

  return (
    <Swiper
      key={index}
      modules={[Autoplay]}
      slidesPerView={isMobile ? 2.5 : 4} // 모바일에서는 2.5개, PC에서는 4개
      spaceBetween={isMobile ? 8 : 20} // 모바일에서는 8px, PC에서는 20px
      loop={true}
      speed={isMobile ? 8000 : 12000} // 모바일에서는 더 빠르게
      autoplay={{ 
        delay: 0, 
        disableOnInteraction: false, 
        pauseOnMouseEnter: false, 
        reverseDirection: index % 2 === 1,
        stopOnLastSlide: false // 마지막 슬라이드에서 멈추지 않음
      }}
      allowTouchMove={false}
      freeMode={false} // freeMode 비활성화로 일정한 속도 유지
      watchSlidesProgress={false} // 슬라이드 진행률 감시 비활성화
      watchOverflow={false} // 오버플로우 감시 비활성화
      style={{ marginBottom: 32 }}
      breakpoints={{
        // 모바일 (768px 이하)
        320: {
          slidesPerView: 2.5,
          spaceBetween: 8,
          speed: 8000
        },
        // 태블릿 (768px - 1024px)
        768: {
          slidesPerView: 3.5,
          spaceBetween: 15,
          speed: 10000
        },
        // PC (1024px 이상)
        1024: {
          slidesPerView: 4,
          spaceBetween: 20,
          speed: 12000
        }
      }}
    >
      {duplicatedRow.map((item, idx) => (
        <SwiperSlide key={`${item.id}-${idx}`} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: isMobile ? 'auto' : 'auto'
        }}>
          <ContentCard {...item} index={index * row.length + (idx % row.length)} onClick={() => onCardClick(item.id)} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
});

export const ContentList: React.FC<ContentListProps> = React.memo(({ contents, onCardClick }) => {
  const rows = useMemo(() =>
    Array.from({ length: ROWS }, (_, i) =>
      contents.filter((_, idx) => idx % ROWS === i)
    ),
    [contents]
  );

  if (contents.length === 0) {
    return (
      <div>
        <h3>AI가 추천하는 우리가 더욱 가까워 지는 방법</h3>
        <p style={{ textAlign: 'center', color: '#666', margin: '2rem 0' }}>
          아직 추천할 콘텐츠가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3>AI가 추천하는 우리가 더욱 가까워 지는 방법</h3>
      <div className="content-list">
        {rows.map((row, i) => (
          <MemoizedSwiper
            key={i}
            row={row}
            index={i}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
});

export default ContentList;