import multiavatar from '@multiavatar/multiavatar';

export const generateAvatar = (seed: string): string => {
  // multiavatar 생성
  const svg = multiavatar(seed);
  
  // SVG를 base64로 인코딩
  const base64 = btoa(svg);
  
  // data URL로 반환
  return `data:image/svg+xml;base64,${base64}`;
};

// 사용자 이메일이나 ID를 기반으로 아바타 생성
export const getUserAvatar = (user: { id?: string; email?: string }): string => {
  // 사용자 ID나 이메일을 시드로 사용
  const seed = user.id || user.email || Math.random().toString();
  return generateAvatar(seed);
}; 