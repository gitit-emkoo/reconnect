import { format, isThisWeek } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

const KOREA_TIME_ZONE = 'Asia/Seoul';

/**
 * UTC 또는 다른 시간대의 날짜를 한국 시간(KST)으로 변환합니다.
 * 서버에서 받은 시간(주로 UTC)을 클라이언트에서 한국 시간으로 보여줄 때 사용합니다.
 * @param date - Date 객체, 숫자(타임스탬프), 또는 날짜 형식의 문자열
 * @returns 한국 시간대의 Date 객체
 */
export const toKST = (date: Date | string | number): Date => {
  return toZonedTime(date, KOREA_TIME_ZONE);
};

/**
 * 주어진 날짜가 한국 시간 기준으로 오늘인지 확인합니다.
 * @param date - 확인할 날짜 (Date, 타임스탬프, 문자열)
 * @returns 오늘이면 true, 아니면 false
 */
export function isTodayKST(date: Date | string | number): boolean {
  const now = toKST(new Date()); // 현재 한국 시간
  const targetDate = toKST(date); // 대상 날짜를 한국 시간으로
  return format(now, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd');
}

/**
 * 날짜를 원하는 형식의 문자열로 변환합니다. (KST 기준)
 * 예: "yyyy-MM-dd", "yyyy년 M월 d일 a h:mm" 등
 * @param date - 포맷할 날짜
 * @param formatStr - 포맷 형식 문자열
 * @returns 포맷된 날짜 문자열
 */
export const formatInKST = (date: Date | string | number, formatStr: string): string => {
  return formatInTimeZone(date, KOREA_TIME_ZONE, formatStr);
};

/**
 * 주어진 날짜가 한국 시간 기준으로 이번 주에 속하는지 확인합니다. (주의 시작: 일요일)
 * @param date - 확인할 날짜 (Date, 타임스탬프, 문자열)
 * @returns 이번 주이면 true, 아니면 false
 */
export function isThisWeekKST(date: Date | string | number): boolean {
  const kstDate = toKST(date);
    // date-fns의 isThisWeek 함수를 사용하고, 주의 시작을 일요일(0)로 명시합니다.
  return isThisWeek(kstDate, { weekStartsOn: 0 });
} 