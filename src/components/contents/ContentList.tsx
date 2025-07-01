import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import styled from 'styled-components';
import { ContentCard } from './ContentCard';
import type { Content } from '../../types/content';

interface ContentListProps {
  contents: Content[];
  onCardClick: (id: string) => void;
}

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 24px 0 16px 20px;
`;

const SwiperWrapper = styled.div`
  margin-bottom: 24px;
  .swiper-wrapper {
    transition-timing-function: linear !important;
  }
`;

const MemoizedSwiper: React.FC<{
  row: Content[];
  index: number;
  onCardClick: (id: string) => void;
}> = React.memo(({ row, index, onCardClick }) => {
  // 3배 복제하여 무한 슬라이드 효과
  const duplicatedRow = row.length > 0 ? [...row, ...row, ...row] : [];
  return (
    <SwiperWrapper>
      <Swiper
        modules={[Autoplay]}
        slidesPerView={4}
        spaceBetween={40}
        loop={true}
        speed={8000 + index * 1000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          reverseDirection: index % 2 === 1, // 짝수줄(두번째줄)은 오른쪽, 나머지는 왼쪽
        }}
        allowTouchMove={true}
        freeMode={false}
        breakpoints={{
          1024: { slidesPerView: 4, spaceBetween: 40 },
          768: { slidesPerView: 4, spaceBetween: 16 },
          480: { slidesPerView: 3.5, spaceBetween: 2 },
          0: { slidesPerView: 2.2, spaceBetween: 2 },
        }}
      >
        {duplicatedRow.map((item, idx) => (
          <SwiperSlide key={`${item.id}-${idx}`}>
            <ContentCard
              {...item}
              index={index * row.length + (idx % row.length)}
              onClick={() => onCardClick(item.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </SwiperWrapper>
  );
});

export const ContentList: React.FC<ContentListProps> = React.memo(({ contents, onCardClick }) => {
  // 최대 3줄까지, 한 줄에 4개씩 분할
  const rows = useMemo(() => {
    const numRows = Math.min(Math.ceil(contents.length / 4), 3);
    return Array.from({ length: numRows }, (_, i) =>
      contents.filter((_, idx) => Math.floor(idx / 4) === i)
    );
  }, [contents]);

  if (contents.length === 0) {
    return (
      <div>
        <SectionTitle>AI가 추천하는 우리가 더욱 가까워 지는 방법</SectionTitle>
        <p style={{ textAlign: 'center', color: '#666', margin: '2rem 0' }}>
          아직 추천할 컨텐츠가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle>AI가 추천하는 우리가 더욱 가까워 지는 방법</SectionTitle>
      {rows.map((row, i) => (
        <MemoizedSwiper key={i} row={row} index={i} onCardClick={onCardClick} />
      ))}
    </div>
  );
});

export default ContentList;