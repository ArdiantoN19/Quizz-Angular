export type TAnswer = {
    id: string;
    answer: string;
    isCorrect: boolean;
    questionId: string;
    createdAt: string;
    updatedAt: string;
}

export type TPayloadAnswerAdd = Omit<TAnswer, 'id' | 'createdAt' | 'updatedAt'>