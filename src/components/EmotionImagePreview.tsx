import React from 'react';

// 타입 정의
export interface Emotion {
  name: string;
  color: string;
}
export interface Trigger {
  name: string;
  IconComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}
export type PaletteItem =
  | { type: 'emotion'; data: Emotion }
  | { type: 'trigger'; data: Trigger };

// 랜덤 배치 정보 생성 함수
export function generateRandomInfo(palette: PaletteItem[]) {
  return palette.map((item) => {
    const centerX = 0.5; // 중심을 비율로 표현
    const centerY = 0.5;
    if (item.type === 'emotion') {
      return {
        ...item,
        x: centerX,
        y: centerY,
        size: 0.45, // 크기를 비율로 표현
        color: (item.data as Emotion).color,
        isEmotion: true,
      };
    } else {
      // 트리거 요소들을 무늬처럼 크게 설정 (밖으로 삐져나가게)
      const baseSizeRatio = 0.5; // 기본 크기 비율
      const sizeVariation = 0.1; // 편차를 작게 (±10%)
      const elementSizeRatio = baseSizeRatio + (Math.random() - 0.5) * sizeVariation;
      const minR = 0.1; // 비율로 표현
      const maxR = 0.4; // 동그라미 밖으로 나가도록 범위 확장
      const angle = Math.random() * 2 * Math.PI;
      const radius = minR + Math.random() * (maxR - minR);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // 랜덤 회전 각도 생성 (오늘 날짜 기반 + 랜덤)
      const today = new Date();
      const dateBasedRotation = (today.getDate() * 30) % 360;
      const randomRotation = Math.random() * 360;
      const rotation = (dateBasedRotation + randomRotation) % 360;
      
      return {
        ...item,
        x,
        y,
        size: elementSizeRatio,
        rotation, // 회전 각도 추가
        isEmotion: false,
      };
    }
  });
}

// palette 변환 유틸
export function convertToPaletteItem(element: any): PaletteItem {
  if (element.type === 'emotion') {
    const { type, ...data } = element;
    return {
      type: 'emotion',
      data
    };
  } else {
    const { type, ...data } = element;
    return {
      type: 'trigger',
      data
    };
  }
}

// 미리보기 컴포넌트
const EmotionImagePreview: React.FC<{
  containerColor: string;
  palette: any[];
  size?: number;
}> = ({ containerColor, palette, size = 600 }) => {
  const imageSize = size;
  // palette에 이미 위치/크기/회전 정보가 있으면 그대로 사용, 없으면 generateRandomInfo 호출
  const randomInfo = palette.some(p => p.x !== undefined && p.y !== undefined) 
    ? palette 
    : generateRandomInfo(palette);
    
  return (
    <svg width={imageSize} height={imageSize} viewBox={`0 0 ${imageSize} ${imageSize}`}>
      <defs>
        <clipPath id={`circle-clip-${imageSize}`}>
          <circle cx={imageSize/2} cy={imageSize/2} r={imageSize/2} />
        </clipPath>
      </defs>
      <circle cx={imageSize/2} cy={imageSize/2} r={imageSize/2} fill={containerColor} />
      <g clipPath={`url(#circle-clip-${imageSize})`}>
        {randomInfo.map((p: any, index: number) => {
          // 비율을 실제 픽셀로 변환
          const actualX = p.x * imageSize;
          const actualY = p.y * imageSize;
          const actualSize = p.size * imageSize;
          const transform = `translate(${actualX - actualSize/2}, ${actualY - actualSize/2})`;
          const key = `element-${index}`;
          if (p.isEmotion) {
            return (
              <g key={key} transform={transform} style={{ zIndex: 10 }}>
                <circle
                  cx={actualSize/2}
                  cy={actualSize/2}
                  r={actualSize/2}
                  fill={p.color}
                  opacity={0.95}
                />
              </g>
            );
          } else if (p.type === 'trigger') {
            const Icon = p.data.IconComponent;
            const rotateTransform = `rotate(${p.rotation || 0}, ${actualSize/2}, ${actualSize/2})`;
            return (
              <g key={key} transform={transform} style={{ zIndex: 5 }}>
                <g transform={rotateTransform}>
                  <Icon
                    width={actualSize * 0.95}
                    height={actualSize * 0.95}
                    x={actualSize * 0.025}
                    y={actualSize * 0.025}
                    style={{
                      opacity: 0.8,
                    }}
                  />
                </g>
              </g>
            );
          }
          return null;
        })}
      </g>
    </svg>
  );
};

export default EmotionImagePreview; 