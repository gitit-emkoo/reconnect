import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const challengeTemplates = [
  // 일상 공유 카테고리
  {
    title: '오늘의 하루 공유하기',
    description: '오늘 있었던 특별한 순간이나 감정을 파트너와 공유해보세요.',
    category: 'DAILY_SHARE',
    isOneTime: false,
    frequency: 1,
    durationDays: 7,
    points: 10,
  },
  {
    title: '일주일 하이라이트',
    description: '일주일 동안 있었던 가장 특별한 순간을 정리해서 공유해보세요.',
    category: 'DAILY_SHARE',
    isOneTime: false,
    frequency: 1,
    durationDays: 7,
    points: 20,
  },

  // 함께하기 카테고리
  {
    title: '함께하는 저녁 식사',
    description: '같은 메뉴를 준비하고 화상 통화로 함께 식사해보세요.',
    category: 'TOGETHER_ACT',
    isOneTime: false,
    frequency: 2,
    durationDays: 7,
    points: 15,
  },
  {
    title: '함께하는 영화 감상',
    description: '같은 영화를 보고 서로의 생각을 나눠보세요.',
    category: 'TOGETHER_ACT',
    isOneTime: true,
    frequency: 1,
    durationDays: 1,
    points: 20,
  },

  // 감정표현 카테고리
  {
    title: '감정 일기 쓰기',
    description: '오늘 느낀 감정을 일기로 작성하고 파트너와 공유해보세요.',
    category: 'EMOTION_EXPR',
    isOneTime: false,
    frequency: 3,
    durationDays: 7,
    points: 15,
  },
  {
    title: '감사 표현하기',
    description: '파트너에게 감사한 마음을 전달해보세요.',
    category: 'EMOTION_EXPR',
    isOneTime: false,
    frequency: 1,
    durationDays: 7,
    points: 10,
  },

  // 기억쌓기 카테고리
  {
    title: '추억의 사진 공유',
    description: '함께 찍은 특별한 순간의 사진을 공유하고 그때의 기억을 나눠보세요.',
    category: 'MEMORY_BUILD',
    isOneTime: false,
    frequency: 2,
    durationDays: 7,
    points: 15,
  },
  {
    title: '우리의 첫 만남',
    description: '처음 만났을 때의 기억을 되새기며 이야기해보세요.',
    category: 'MEMORY_BUILD',
    isOneTime: true,
    frequency: 1,
    durationDays: 1,
    points: 25,
  },

  // 마음 돌보기 카테고리
  {
    title: '서로의 하루 물어보기',
    description: '파트너의 하루를 진심으로 물어보고 공감해주세요.',
    category: 'SELF_CARE',
    isOneTime: false,
    frequency: 1,
    durationDays: 7,
    points: 10,
  },
  {
    title: '힘든 순간 위로하기',
    description: '파트너가 힘들어하는 순간에 따뜻한 위로의 말을 건네보세요.',
    category: 'SELF_CARE',
    isOneTime: false,
    frequency: 1,
    durationDays: 7,
    points: 20,
  },

  // 함께 성장 카테고리
  {
    title: '목표 공유하기',
    description: '각자의 목표를 공유하고 서로 응원해주세요.',
    category: 'GROW_TOGETHER',
    isOneTime: false,
    frequency: 1,
    durationDays: 7,
    points: 15,
  },
  {
    title: '함께하는 독서',
    description: '같은 책을 읽고 서로의 생각을 나눠보세요.',
    category: 'GROW_TOGETHER',
    isOneTime: true,
    frequency: 1,
    durationDays: 14,
    points: 30,
  },
];

async function main() {
  console.log('🌱 챌린지 템플릿 데이터 생성 시작...');

  try {
    // 기존 챌린지 템플릿 삭제
    await prisma.challengeTemplate.deleteMany({});
    console.log('기존 챌린지 템플릿 삭제 완료');

    // 새로운 챌린지 템플릿 생성
    for (const template of challengeTemplates) {
      await prisma.challengeTemplate.create({
        data: template,
      });
    }

    console.log('✅ 챌린지 템플릿 데이터 생성 완료!');
  } catch (error) {
    console.error('❌ 챌린지 템플릿 데이터 생성 중 오류 발생:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 