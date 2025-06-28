export interface Question {
  text: string;
  scores: {
    yes: number;
    neutral: number;
    no: number;
  };
}

export const diagnosisQuestions: Question[] = [
  { text: "최근 1주일 안에 포옹이나 스킨십을 했나요?", scores: { yes: 2, neutral: 1, no: 0 } },
  { text: "요즘 배우자와 대화할 때 감정이 통한다고 느끼시나요?", scores: { yes: 2, neutral: 1, no: 0 } },
  { text: "서로의 기분이나 일상에 관심을 표현하나요?", scores: { yes: 2, neutral: 1, no: 0 } },
  { text: "최근 배우자에게 고맙다고 표현한 적이 있나요?", scores: { yes: 2, neutral: 1, no: 0 } },
  { text: "마지막 스킨십 시도가 어색하거나 불편했나요?", scores: { yes: 0, neutral: 1, no: 2 } },
  { text: "요즘 배우자와 단둘이 보내는 시간이 있나요?", scores: { yes: 2, neutral: 1, no: 0 } }
];

export const MAX_SCORE = diagnosisQuestions.reduce((max, q) => {
  return max + Math.max(q.scores.yes, q.scores.neutral, q.scores.no);
}, 0); 