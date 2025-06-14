// KST(한국시간) 변환 함수
export function toKST(date: Date | string) {
  const d = new Date(date);
  return new Date(d.getTime() + 9 * 60 * 60 * 1000);
}

// KST 기준 오늘 날짜인지 판별
export function isTodayKST(date: Date | string) {
  const now = toKST(new Date());
  const target = toKST(date);
  return (
    now.getFullYear() === target.getFullYear() &&
    now.getMonth() === target.getMonth() &&
    now.getDate() === target.getDate()
  );
} 