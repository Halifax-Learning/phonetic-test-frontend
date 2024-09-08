export interface QuestionType {
    questionTypeId: number
    name: string
    instructionText: string
    instructionAudioB64Encode: string
}

export interface Question {
    questionId: string
    questionType: QuestionType
    questionText: string
    questionAudioB64Encode: string
    correctAnswerText: string
    correctAnswerAudioB64Encode: string
}

export interface TestQuestion {
    testQuestionId: string
    question: Question
    answerText: string
    answerAudioB64Encode: string
    humanEvaluation: boolean
    humanEvaluatorId: string
    machineEvaluation: number
}

export interface TestType {
    testTypeId: number
    questionTypeId: number
    name: string
    numQuestions: number
}

export interface Test {
    testId: string
    testType: TestType
    testTakerId: string
    instructionText: string
    instructionAudioB64Encode: string
    submissionTime: Date
    numCorrectAnswers: number
    testQuestions: TestQuestion[]
}
