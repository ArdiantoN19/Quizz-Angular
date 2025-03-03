export type TQuestion = {
  id: string;
  question: string;
  quizId: string;
  updatedAt: string;
  createdAt: string;
};

export type payloadAnswerAdd = {
  answers: string[];
  isCorrect: number;
};

export type TResultAnswer = {
  id: string;
  question: string;
  answers: Array<{ id: string; answer: string }>;
  isCorrect: number;
};

export type TAddQuestionResponse = { quizId: string } & TResultAnswer;

export type TPayloadQuestionAdd = Omit<
  TQuestion,
  'id' | 'createdAt' | 'updatedAt'
> &
  payloadAnswerAdd;
