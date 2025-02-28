import { TYPEQUIZENUM } from '../../utils/constant';

type TCategory = {
  id: string;
  name: string;
  slug: string;
};

type TUser = {
  id: string;
  fullname: string;
};

export type TDifficulty = TCategory;
export type TTypeQuiz = TCategory;

export type TQuizTransform = {
  id: string;
  category: TCategory;
  user: TUser;
  title: string;
  description: string;
  timer: number;
  isPublished: boolean;
  thumbnail: string;
  difficulty: TDifficulty;
  slug: string;
  typeQuiz: TTypeQuiz;
  createdAt: string;
  updatedAt: string;
  totalQuestion: number;
};

export type TQuiz = {
  id: string;
  categoryId: string;
  createdBy: string;
  title: string;
  description: string;
  timer: number;
  isPublished: boolean;
  thumbnail: string;
  difficultyId: string;
  slug: string;
  typeQuizId: string;
  createdAt: string;
  updatedAt: string;
};

export type TPayloadQuiz = Omit<
  TQuiz,
  'id' | 'createdAt' | 'updatedAt' | 'isPublished' | 'slug' | 'createdBy'
>;

export type TPayloadQuestionStepper = {
  question: string;
  answers: string[];
  isCorrect: number;
};

export type TPayloadQuestion = TPayloadQuestionStepper;

export type TPayloadQuizStepper = {
  totalQuestion: number;
  typeQuiz: TYPEQUIZENUM;
} & TPayloadQuiz;
