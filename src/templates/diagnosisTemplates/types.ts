export interface DiagnosisQuestion {
  id: string;
  text: string;
  options?: { text: string; value: number }[];
  scores?: { yes: number; no: number; neutral: number };
}

export interface DiagnosisTemplate {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  questions: DiagnosisQuestion[];
  calculateScore: (answers: number[]) => number;
  getResultMessage?: (score: number) => string;
} 