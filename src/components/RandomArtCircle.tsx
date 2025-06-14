import React from "react";

const palette = [
  "#90caf9", "#f48fb1", "#ffd54f", "#a5d6a7", "#ce93d8", "#ffb74d", "#b2dfdb", "#e1bee7"
];
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const RandomArtCircle: React.FC<{ size?: number; shapeCount?: number }> = ({ size = 120, shapeCount = 4 }) => {
  // 랜덤 도형 정보 생성
  const shapes = Array.from({ length: shapeCount }).map((_) => {
    const type = Math.random() > 0.5 ? "circle" : "line";
    const color = palette[getRandomInt(0, palette.length - 1)];
    if (type === "circle") {
      return {
        type,
        cx: getRandomInt(20, size - 20),
        cy: getRandomInt(20, size - 20),
        r: getRandomInt(12, 28),
        fill: color,
        opacity: Math.random() * 0.5 + 0.5
      };
    } else {
      return {
        type,
        x1: getRandomInt(10, size - 10),
        y1: getRandomInt(10, size - 10),
        x2: getRandomInt(10, size - 10),
        y2: getRandomInt(10, size - 10),
        stroke: color,
        strokeWidth: getRandomInt(2, 6),
        opacity: Math.random() * 0.5 + 0.5
      };
    }
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 원형 배경 */}
      <circle cx={size/2} cy={size/2} r={size/2} fill={palette[getRandomInt(0, palette.length - 1)]} />
      {/* 랜덤 도형들 */}
      {shapes.map((shape, i) =>
        shape.type === "circle" ? (
          <circle
            key={i}
            cx={shape.cx}
            cy={shape.cy}
            r={shape.r}
            fill={shape.fill}
            opacity={shape.opacity}
          />
        ) : (
          <line
            key={i}
            x1={shape.x1}
            y1={shape.y1}
            x2={shape.x2}
            y2={shape.y2}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            opacity={shape.opacity}
            strokeLinecap="round"
          />
        )
      )}
    </svg>
  );
}; 