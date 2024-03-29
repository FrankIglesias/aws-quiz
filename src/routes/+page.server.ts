import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

import questions from './quiz.server';
const MIN_QUESTION_ID  = 0;
const MAX_QUESTION_ID = 1141;
export const load = (() => {
  const questionIndex = Math.floor(Math.random() * (MAX_QUESTION_ID - MIN_QUESTION_ID + 1)) + MIN_QUESTION_ID;
  return {
    question: { question: questions[questionIndex].question,
      options: questions[questionIndex].options,
      questionNumber: questions[questionIndex].questionNumber,
    },
    token: btoa(JSON.stringify([questions[questionIndex].questionNumber])),
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ( { request }) => {
    const formData = await request.json();
    const { token, answers, question } = formData;
	  if (!token ||   !answers || !question) {
	    return fail(401, { message: 'Invalid data' })
	  }

    const previousQuestion = questions.find((q) => q.questionNumber === question)!;
    if(answers.length !== previousQuestion.correctAnswer.length || !previousQuestion.correctAnswer.every((answer) => answers.includes(answer))) {
      return fail(401, { message: 'Invalid answer, correct answer is ' + previousQuestion.correctAnswer.join(', ') });
    }
    const answeredQuestions = JSON.parse(atob(token));
    const unansweredQuestions = questions.filter((question) => !answeredQuestions.includes(question.questionNumber));
    const nextQuestionIndex = Math.floor(Math.random() * unansweredQuestions.length);
    const newQuestion = unansweredQuestions[nextQuestionIndex];
		return { question: {
      question: newQuestion.question,
      options: newQuestion.options,
      questionNumber: newQuestion.questionNumber,
    }, token: btoa(JSON.stringify([newQuestion.questionNumber, ...answeredQuestions]))};
	}
} satisfies Actions;
