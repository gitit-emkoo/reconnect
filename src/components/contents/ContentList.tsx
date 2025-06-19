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
  margin-bottom: 16px;
  .swiper-wrapper {
    transition-timing-function: linear !important;
  }
`;

const MemoizedSwiper: React.FC<{
  row: Content[];
  index: number;
  onCardClick: (id: string) => void;
}> = React.memo(({ row, index, onCardClick }) => {
  // Swiper가 올바르게 반응형으로 작동하려면 state보다는 CSS 미디어 쿼리를 사용하는 것이 더 안정적입니다.
  // 이 컴포넌트는 이제 Swiper의 설정만 담당합니다.

  // loop 모드가 끊김없이 작동하려면 슬라이드 개수가 slidesPerView보다 최소 2배 이상 많아야 합니다.
  // 카드를 3번 반복해서 연속 효과 생성
  const duplicatedRow = row.length > 0 ? [...row, ...row, ...row] : [];

  return (
    <SwiperWrapper>
      <Swiper
        modules={[Autoplay]}
        slidesPerView={2.5}
        spaceBetween={8}
        loop={true}
        speed={8000 + index * 1000} // 각 줄마다 속도를 약간 다르게
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          reverseDirection: index % 2 === 1,
        }}
        allowTouchMove={true}
        freeMode={false}
        breakpoints={{
          768: { slidesPerView: 3.5, spaceBetween: 15 },
          1024: { slidesPerView: 4.5, spaceBetween: 20 },
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
  const rows = useMemo(() => {
    // 콘텐츠가 10개 미만이면 한 줄로, 그 이상이면 2줄로 나누어 보여줍니다.
    const numRows = contents.length < 10 ? 1 : 2;
    return Array.from({ length: numRows }, (_, i) =>
      contents.filter((_, idx) => idx % numRows === i)
    );
  }, [contents]);

  if (contents.length === 0) {
    return (
      <div>
        <SectionTitle>AI가 추천하는 우리가 더욱 가까워 지는 방법</SectionTitle>
        <p style={{ textAlign: 'center', color: '#666', margin: '2rem 0' }}>
          아직 추천할 콘텐츠가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      {rows[0] && rows[0].length > 0 && (
        <>
          <SectionTitle>AI가 추천하는 우리가 더욱 가까워 지는 방법</SectionTitle>
          <MemoizedSwiper row={rows[0]} index={0} onCardClick={onCardClick} />
        </>
      )}

      {rows[1] && rows[1].length > 0 && (
        <>
          <SectionTitle>관계 가이드 아티클</SectionTitle>
          <MemoizedSwiper row={rows[1]} index={1} onCardClick={onCardClick} />
        </>
      )}
    </div>
  );
});

export default ContentList;