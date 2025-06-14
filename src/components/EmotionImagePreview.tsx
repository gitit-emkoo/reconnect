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
export function generateRandomInfo(palette: PaletteItem[], imageSize = 600) {
  return palette.map((item) => {
    const centerX = imageSize / 2;
    const centerY = imageSize / 2;
    if (item.type === 'emotion') {
      return {
        ...item,
        x: centerX,
        y: centerY,
        size: imageSize * 0.45,
        color: (item.data as Emotion).color,
        isEmotion: true,
      };
    } else {
      const minR = imageSize * 0.25;
      const maxR = imageSize * 0.48;
      const angle = Math.random() * 2 * Math.PI;
      const radius = minR + Math.random() * (maxR - minR);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const size = imageSize * (0.8 + Math.random() * 0.05);
      return {
        ...item,
        x,
        y,
        size,
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
  const randomInfo = palette;
  return (
    <svg width={imageSize} height={imageSize} viewBox={`0 0 ${imageSize} ${imageSize}`}>
      <defs>
        <clipPath id="circle-clip">
          <circle cx={imageSize / 2} cy={imageSize / 2} r={imageSize / 2} />
        </clipPath>
      </defs>
      <circle cx={imageSize/2} cy={imageSize/2} r={imageSize/2} fill={containerColor} />
      <g clipPath="url(#circle-clip)">
        {randomInfo.map((p: any, index: number) => {
          const transform = `translate(${p.x - p.size/2}, ${p.y - p.size/2})`;
          const key = `element-${index}`;
          if (p.isEmotion) {
            return (
              <g key={key} transform={transform} style={{ zIndex: 10 }}>
                <circle
                  cx={p.size/2}
                  cy={p.size/2}
                  r={p.size/2}
                  fill={p.color}
                  opacity={0.95}
                />
              </g>
            );
          } else if (p.type === 'trigger') {
            const Icon = p.data.IconComponent;
            return (
              <g key={key} transform={transform} style={{ zIndex: 5 }}>
                <Icon
                  width={p.size * 0.7}
                  height={p.size * 0.7}
                  style={{
                    opacity: 0.95,
                  }}
                />
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