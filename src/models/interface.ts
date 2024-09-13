export interface QuestionType {
    questionTypeId: number
    questionTypeName: string
    questionInstructionText: string
    instructionAudioB64Encode: string
}

export interface Question {
    questionId: number
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
    answerAudioBlobUrl: string
    answerAudioB64Encode: string
}

export interface TestType {
    testTypeId: number
    questionTypeId: number
    testTypeName: string
    numQuestions: number
    questionInstructionText: string
}

export interface Test {
    testId: string
    testType: TestType
    assessmentId: string
    questionInstructionText: string
    instructionAudioB64Encode: string
    submissionTime: Date
    numCorrectAnswers: number
    testQuestions: TestQuestion[]
}

export interface AssessmentType {
    assessmentTypeId: number
    assessmentTypeName: string
}

export interface Assessment {
    assessmentId: string
    assessmentType: AssessmentType
    testTypes: TestType[]
    submissionTime: Date
}
