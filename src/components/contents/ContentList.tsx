// import React, { useMemo } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/autoplay';
// import { ContentCard } from './ContentCard';
// import type { Content } from '../../types/content';

// const ROWS = 5;

// interface ContentListProps {
//   contents: Content[];
//   onCardClick: (id: string) => void;
// }

// // Swiper 컴포넌트 메모이제이션
// const MemoizedSwiper = React.memo(({ 
//   row, 
//   index, 
//   onCardClick 
// }: { 
//   row: Content[], 
//   index: number,
//   onCardClick: (id: string) => void 
// }) => (
//   <Swiper
//     key={index}
//     slidesPerView={4}
//     spaceBetween={20}
//     loop
//     speed={20000}
//     autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: false, reverseDirection: index % 2 === 1 }}
//     freeMode={true}
//     allowTouchMove={false}
//     style={{ marginBottom: 32 }}
//   >
//     {row.map((item, idx) => (
//       <SwiperSlide key={item.id} style={{ minWidth: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <ContentCard {...item} index={index * row.length + idx} onClick={() => onCardClick(item.id)} />
//       </SwiperSlide>
//     ))}
//   </Swiper>
// ));

// export const ContentList: React.FC<ContentListProps> = React.memo(({ contents, onCardClick }) => {
//   // 줄별로 콘텐츠 분할 - 메모이제이션
//   const rows = useMemo(() => 
//     Array.from({ length: ROWS }, (_, i) =>
//       contents.filter((_, idx) => idx % ROWS === i)
//     ),
//     [contents]
//   );

//   if (contents.length === 0) {
//     return (
//       <div>
//         <h3>AI가 추천하는 콘텐츠</h3>
//         <p style={{ textAlign: 'center', color: '#666', margin: '2rem 0' }}>
//           아직 추천할 콘텐츠가 없습니다.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h3>AI가 추천하는 콘텐츠</h3>
//       <div className="content-list">
//         {rows.map((row, i) => (
//           <MemoizedSwiper
//             key={i}
//             row={row}
//             index={i}
//             onCardClick={onCardClick}
//           />
//         ))}
//       </div>
//     </div>
//   );
// });

// export default ContentList; 

import React, { useMemo } from 'react';
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
}) => (
  <Swiper
    key={index}
    modules={[Autoplay]}
    slidesPerView={'auto'}
    spaceBetween={10}
    loop={true}
    speed={10000}
    autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: false, reverseDirection: index % 2 === 1 }}
    allowTouchMove={false}
    style={{ marginBottom: 32 }}
  >
    {row.map((item, idx) => (
      <SwiperSlide key={item.id} style={{ minWidth: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ContentCard {...item} index={index * row.length + idx} onClick={() => onCardClick(item.id)} />
      </SwiperSlide>
    ))}
  </Swiper>
));

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
        <h3>AI가 추천하는 콘텐츠</h3>
        <p style={{ textAlign: 'center', color: '#666', margin: '2rem 0' }}>
          아직 추천할 콘텐츠가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3>AI가 추천하는 콘텐츠</h3>
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